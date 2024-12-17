import React, { useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  ErrorMessage,
  Heading,
  HStack,
  List,
  TextField,
  ToggleGroup,
  VStack,
} from '@navikt/ds-react';
import { useSokPerson } from '@/data/personoversiktHooks';
import { SokDTO } from '@/api/types/sokDTO';
import SokPersonResultat from '@/sider/sokperson/SokPersonResultat';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { isNumeric, removePunctuation } from '@/utils/stringUtil';
import { parseDateString } from '@/utils/dateUtils';
import * as Amplitude from '@/utils/amplitude';

const texts = {
  header: 'Søk etter sykmeldt',
  info:
    'Her kan du søke opp sykmeldte personer basert på initialer og fødselsdato.',
  validation: {
    birthdateOrName: 'Vennligst angi navn eller fødselsdato',
    name: 'Vennligst angi gyldig navn',
    initials: 'Vennligst angi gyldige initialer',
    birthdate: 'Vennligst angi en gyldig fødselsdato',
  },
  error: 'Noe gikk galt under søket. Vennligst prøv igjen.',
};

function logSokPersonEvent() {
  Amplitude.logEvent({
    type: Amplitude.EventType.ButtonClick,
    data: {
      url: window.location.href,
      tekst: 'Søk etter sykmeldt',
    },
  });
}

function logSokPersonResults(amount: number, requestDTO: SokDTO) {
  const hasInitials = !!requestDTO.initials;
  const hasBirthdate = !!requestDTO.birthdate;
  Amplitude.logEvent({
    type: Amplitude.EventType.AmountDisplayed,
    data: {
      url: window.location.href,
      antall: amount,
      handling:
        'Søk etter sykmeldt - resultater' +
        (hasBirthdate ? '- fødselsdato' : '') +
        (hasInitials ? '- initialer' : ''),
    },
  });
}

const parseBirthdate = (birthdate: string): Date | null => {
  const cleanedDateStr = removePunctuation(birthdate);

  if (
    (cleanedDateStr.length !== 6 && cleanedDateStr.length !== 8) ||
    !isNumeric(cleanedDateStr)
  ) {
    return null;
  } else {
    return parseDateString(cleanedDateStr);
  }
};

function isValidInitials(initials: string): boolean {
  return initials !== '' && initials.length <= 3 && initials.length > 1;
}

function isValidName(name: string): boolean {
  const names = name.split(' ');
  return name !== '' && names.length > 1 && names.every((a) => a.length >= 2);
}

function isValidBirthdate(birthdate: string): boolean {
  return birthdate !== '' && parseBirthdate(birthdate) !== null;
}

interface ErrorMessageProps {
  name: string;
  initials: string;
  birthdate: string;
  searchtype: SearchType;
}

function ErrorMessageForm({
  name,
  initials,
  birthdate,
  searchtype,
}: ErrorMessageProps) {
  switch (searchtype) {
    case SearchType.NAME_AND_DATE: {
      return (
        <>
          {name === '' && birthdate === '' && (
            <ErrorMessage size="small">
              {texts.validation.birthdateOrName}
            </ErrorMessage>
          )}
          {name !== '' && !isValidName(name) && (
            <ErrorMessage size="small">{texts.validation.name}</ErrorMessage>
          )}
          {birthdate !== '' && !isValidBirthdate(birthdate) && (
            <ErrorMessage size="small">
              {texts.validation.birthdate}
            </ErrorMessage>
          )}
        </>
      );
    }
    case SearchType.INITIALS_AND_DATE: {
      return (
        <>
          {initials !== '' && !isValidInitials(initials) && (
            <ErrorMessage size="small">
              {texts.validation.initials}
            </ErrorMessage>
          )}
        </>
      );
    }
  }
}

enum SearchType {
  NAME_AND_DATE = 'NAME_AND_DATE',
  INITIALS_AND_DATE = 'INITIALS_AND_DATE',
}

export default function SokPerson() {
  const [name, setName] = useState<string>('');
  const [initials, setInitials] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [searchtype, setSearchtype] = useState<SearchType>(
    SearchType.NAME_AND_DATE
  );
  const {
    mutate,
    data: searchResults,
    isLoading,
    isError,
    isSuccess,
  } = useSokPerson();
  const [isFormError, setIsFormError] = useState<boolean>(false);

  const handleSubmit = () => {
    if (isFormValid()) {
      const parsedBirthdate = parseBirthdate(birthdate);
      const requestDTO: SokDTO = {
        name: isValidName(name) ? name : undefined,
        initials: isValidInitials(initials)
          ? initials.toLowerCase()
          : undefined,
        birthdate: !!parsedBirthdate ? parsedBirthdate : undefined,
      };
      mutate(requestDTO, {
        onSuccess: (data) => logSokPersonResults(data.length, requestDTO),
        onSettled: () => logSokPersonEvent(),
      });
    } else {
      setIsFormError(true);
    }
  };

  function isFormValid() {
    switch (searchtype) {
      case SearchType.NAME_AND_DATE:
        return isValidName(name) || isValidBirthdate(birthdate);
      case SearchType.INITIALS_AND_DATE:
        return (
          (isValidInitials(initials) && isValidBirthdate(birthdate)) ||
          isValidBirthdate(birthdate)
        );
    }
  }

  const isNameFieldError =
    isFormError && (birthdate === '' || name !== '') && !isValidName(name);
  const isInitialsFieldError =
    isFormError && initials !== '' && !isValidInitials(initials);
  const isBirthdateFieldError =
    (isFormError && name === '' && birthdate === '') ||
    (birthdate !== '' && !isValidBirthdate(birthdate));

  const handleSearchtypeChange = (val: string) =>
    setSearchtype(val as SearchType);

  const birthdateLabel =
    searchtype === SearchType.INITIALS_AND_DATE
      ? 'Fødselsdato (obligatorisk)'
      : 'Fødselsdato (valgfritt)';

  return (
    <>
      <Box background="surface-default" padding="4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Heading level="2" size="medium">
            {texts.header}
          </Heading>
          <VStack gap="4">
            <BodyShort>{texts.info}</BodyShort>
            <List
              as="ul"
              size="small"
              title="Det kan også være aktuelt hvis du:"
            >
              <List.Item>
                står i fare for å miste jobben etter å ha vært sykmeldt helt
                eller delvis i 12 måneder,
              </List.Item>
              <List.Item>
                har full eller gradert uføretrygd, men ønsker å jobbe. NAV må ha
                vurdert om andre arbeidsmarkedstiltak og virkemidler er
                aktuelle, eller
              </List.Item>
              <List.Item>
                er en arbeidssøker med varig og vesentlig nedsatt arbeidsevne
                som kan bli ansatt i en vanlig jobb.
              </List.Item>
            </List>
            <ToggleGroup
              defaultValue="NAME_AND_DATE"
              onChange={handleSearchtypeChange}
              label="Velg søkealternativ"
              size="small"
            >
              <ToggleGroup.Item
                value="NAME_AND_DATE"
                label="Navn og fødselsdato"
              />
              <ToggleGroup.Item
                value="INITIALS_AND_DATE"
                label="Initialer og fødselsdato"
              />
            </ToggleGroup>
            <HStack align="end">
              <div className="flex gap-8 min-w-[25rem]">
                {searchtype === SearchType.NAME_AND_DATE && (
                  <TextField
                    label="Navn (valgfritt)"
                    description="Navn Etternavn"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    error={isNameFieldError}
                  />
                )}
                {searchtype === SearchType.INITIALS_AND_DATE && (
                  <TextField
                    label="Initialer (valgfritt)"
                    description="AB"
                    htmlSize={14}
                    type="text"
                    onChange={(e) => setInitials(e.target.value)}
                    error={isInitialsFieldError}
                  />
                )}
                <TextField
                  label={birthdateLabel}
                  description="ddmmåå"
                  htmlSize={14}
                  type="text"
                  onChange={(e) => setBirthdate(e.target.value)}
                  error={isBirthdateFieldError}
                />
              </div>
              <Button
                loading={isLoading}
                icon={<MagnifyingGlassIcon />}
                type="submit"
              >
                Søk
              </Button>
            </HStack>
            {isFormError && (
              <ErrorMessageForm
                birthdate={birthdate}
                name={name}
                initials={initials}
                searchtype={searchtype}
              />
            )}
            {isError && (
              <Alert variant="error" size="small">
                {texts.error}
              </Alert>
            )}
          </VStack>
        </form>
      </Box>
      {searchResults && isSuccess && (
        <SokPersonResultat sokeresultater={searchResults} />
      )}
    </>
  );
}
