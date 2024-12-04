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

function logSokPersonResults(amount: number) {
  Amplitude.logEvent({
    type: Amplitude.EventType.AmountDisplayed,
    data: {
      url: window.location.href,
      antall: amount,
      handling: 'Søk etter sykmeldt - resultater',
    },
  });
}

export default function SokPerson() {
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

  const parseBirthdate = (birthdate: string): Date | null => {
    const cleanedDateStr = removePunctuation(birthdate);

    if (cleanedDateStr.length < 6 || !isNumeric(cleanedDateStr)) {
      return null;
    } else {
      return parseDateString(cleanedDateStr);
    }
  };

  const isValidInitials = (initials: string): boolean => {
    return initials === '' || (initials.length <= 3 && initials.length > 1);
  };

  const handleSubmit = () => {
    const parsedBirthdate = parseBirthdate(birthdate);
    if (isValidInitials(initials) && !!parsedBirthdate) {
      const requestDTO: SokDTO = {
        initials: initials.toLowerCase(),
        birthdate: parsedBirthdate,
      };
      mutate(requestDTO, {
        onSuccess: (data) => logSokPersonResults(data.length),
        onSettled: () => logSokPersonEvent(),
      });
    } else {
      setIsFormError(true);
    }
  };

  const isInvalidInitials = isFormError && !isValidInitials(initials);
  const isInvalidBirthdate = isFormError && parseBirthdate(birthdate) === null;

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
                label="Initialer"
                description="AB"
                htmlSize={10}
                type="text"
                onChange={(e) => setInitials(e.target.value)}
                error={isFormError && !isValidInitials(initials)}
              />
              <TextField
                label="Fødselsdato"
                description="ddmmåå"
                htmlSize={14}
                type="text"
                onChange={(e) => setBirthdate(e.target.value)}
                error={isInvalidBirthdate}
              />
              <Button
                loading={isLoading}
                icon={<MagnifyingGlassIcon />}
                type="submit"
              >
                Søk
              </Button>
            </HStack>
            {isInvalidInitials && (
              <ErrorMessage size="small">
                {texts.validation.initials}
              </ErrorMessage>
            )}
            {isInvalidBirthdate && (
              <ErrorMessage size="small">
                {texts.validation.birthdate}
              </ErrorMessage>
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
