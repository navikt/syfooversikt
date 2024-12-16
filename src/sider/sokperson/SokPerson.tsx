import React, { useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  ErrorMessage,
  Heading,
  HStack,
  TextField,
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
  return initials.length <= 3 && initials.length > 1;
}

function isValidName(name: string): boolean {
  const names = name.split(' ');
  return names.length > 1 && names.every((a) => a.length >= 2);
}

function isInvalidBirthdate(birthdate: string): boolean {
  const parsedBirthdate = parseBirthdate(birthdate) === null;
  return parsedBirthdate;
}

interface ErrorMessageProps {
  name: string;
  initials: string;
  birthdate: string;
}

function ErrorMessageForm({ name, initials, birthdate }: ErrorMessageProps) {
  const isInvalidName = !isValidName(name);
  const isInvalidInitials = !isValidInitials(initials);
  const isFormBlank = name === '' && initials === '' && birthdate === '';

  return (
    <>
      {isFormBlank && (
        <ErrorMessage size="small">
          {texts.validation.birthdateOrName}
        </ErrorMessage>
      )}
      {name !== '' && isInvalidName && (
        <ErrorMessage size="small">{texts.validation.name}</ErrorMessage>
      )}
      {initials !== '' && isInvalidInitials && (
        <ErrorMessage size="small">{texts.validation.initials}</ErrorMessage>
      )}
      {birthdate !== '' && isInvalidBirthdate(birthdate) && (
        <ErrorMessage size="small">{texts.validation.birthdate}</ErrorMessage>
      )}
    </>
  );
}

export default function SokPerson() {
  const [name, setName] = useState<string>('');
  const [initials, setInitials] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
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
    const parsedBirthdate = parseBirthdate(birthdate);
    const isBirthdateAndInitialsSearch =
      !!parsedBirthdate && isValidInitials(initials);
    const isNameSearch = isValidName(name);
    const isBirthdateSearch = !!parsedBirthdate;
    if (isBirthdateAndInitialsSearch) {
      return name === '';
    } else if (isNameSearch) {
      return (
        initials === '' && (birthdate === '' || !isInvalidBirthdate(birthdate))
      );
    } else if (isBirthdateSearch) {
      return (name === '' || isValidName(name)) && initials === '';
    } else {
      return false;
    }
  }

  const isValidBirthdateSearch =
    (name === '' || isValidName(name) || birthdate !== '') &&
    isInvalidBirthdate(birthdate);
  const isValidBirthdateAndInitialsSearch =
    initials !== '' && !isValidInitials(initials) && isValidBirthdateSearch;

  const isNameFieldError =
    isFormError &&
    ((birthdate === '' && initials === '') || name !== '') &&
    !isValidName(name);
  const isInitialsFieldError =
    isFormError && initials !== '' && !isValidInitials(initials);
  const isBirthdateFieldError = isFormError && isValidBirthdateSearch;

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
            <HStack gap="8" align="end">
              <TextField
                label="Navn"
                description="Navn Etternavn"
                htmlSize={14}
                type="text"
                onChange={(e) => setName(e.target.value)}
                error={isNameFieldError}
              />
              <TextField
                label="Initialer"
                description="AB"
                htmlSize={14}
                type="text"
                onChange={(e) => setInitials(e.target.value)}
                error={isInitialsFieldError}
              />
              <TextField
                label="Fødselsdato"
                description="ddmmåå"
                htmlSize={14}
                type="text"
                onChange={(e) => setBirthdate(e.target.value)}
                error={isBirthdateFieldError}
              />
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
