import React, { useState } from 'react';
import {
  Alert,
  BodyLong,
  Box,
  Button,
  ErrorMessage,
  Heading,
  HelpText,
  Label,
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
  info: 'Her kan du søke for å finne brukere med aktivt sykefravær.',
  label: {
    initials: 'Initialer (valgfri)',
    birthdate: 'Fødselsdato (obligatorisk)',
  },
  helpText: {
    info: {
      title: 'Hvordan søke etter sykmeldt?',
      p1:
        'Fyll inn fødselsdato for å finne en sykmeldt du har tilgang til, vedkommende må ha et aktivt sykefravær. ',
      p2:
        'Ønsker man et mer nøyaktig søk kan man legge til initialer til den sykmeldte, men dette er valgfritt. Det er ikke mulig å søke på initialer uten å skrive inn fødselsdato. Dette er for å minimere risiko for feil søkeresultat, og at du finner akkurat den personen du er på leting etter.',
    },
    initials: {
      title: 'Hvordan fyller jeg inn initialer?',
      text:
        'Her kan du fylle inn initialene til den du vil søke opp. Feltet krever forbokstaven for fornavn og etternavn. Det er mulig å legge til forbokstavene for mellomnavn for mer nøyaktig søkeresultat. ',
    },
    birthdate: {
      title: 'Hvordan fyller jeg inn fødselsdato?',
      text: (
        <>
          Her kan du fylle inn fødselsdato til den du vil søke opp. For å kunne
          søke må sifrene fylles inn på formatet:
          <strong> dag måned år</strong>, i den rekkefølgen. Ønsker man et mer
          nøyaktig søk kan man legge til initialer til den sykmeldte i initial
          feltet.
        </>
      ),
    },
  },
  validation: {
    initials: 'Vennligst angi to til fire initialer',
    birthdate: 'Vennligst angi en gyldig fødselsdato',
  },
  error: 'Noe gikk galt under søket. Vennligst prøv igjen.',
};

function logHelpTextClick(text: string) {
  Amplitude.logEvent({
    type: Amplitude.EventType.ButtonClick,
    data: {
      url: window.location.href,
      tekst: text,
    },
  });
}

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

interface LogSokPersonErrorProps {
  birthdate: string;
  isValidBirthdate: boolean;
  isInvalidBirthdate: boolean;
  initials: string;
  isValidInitials: boolean;
  isInvalidInitials: boolean;
  isError: boolean;
}

function logSokPersonError({
  birthdate,
  isValidBirthdate,
  isInvalidBirthdate,
  initials,
  isValidInitials,
  isInvalidInitials,
  isError,
}: LogSokPersonErrorProps) {
  Amplitude.logEvent({
    type: Amplitude.EventType.ErrorMessageShowed,
    data: {
      url: window.location.href,
      handling: 'Søk etter sykmeldt - feilmeldinger',
      feilmelding:
        'Fødselsdato: ' +
        getValidationMessage({
          value: birthdate,
          isValid: isValidBirthdate,
          isInvalid: isInvalidBirthdate,
        }) +
        ' - Initialer: ' +
        getValidationMessage({
          value: initials,
          isValid: isValidInitials,
          isInvalid: isInvalidInitials,
        }) +
        (isError ? ' - Feil ved søk' : ''),
    },
  });
}

interface ValidationArgs {
  value: string;
  isValid: boolean;
  isInvalid: boolean;
}

function getValidationMessage({
  value,
  isValid,
  isInvalid,
}: ValidationArgs): string {
  if (value === '') {
    return 'ingen innhold';
  }
  if (isValid) {
    return 'gyldig innhold';
  }
  if (isInvalid) {
    return 'ugyldig innhold';
  }
  return '';
}

function InitialerLabel() {
  return (
    <div className="flex gap-2">
      {texts.label.initials}
      <HelpText
        title={texts.helpText.initials.title}
        onClick={() => logHelpTextClick(texts.helpText.initials.title)}
      >
        <Label>{texts.helpText.initials.title}</Label>
        <BodyLong>{texts.helpText.initials.text}</BodyLong>
      </HelpText>
    </div>
  );
}

function FodselsdatoLabel() {
  return (
    <div className="flex gap-2">
      {texts.label.birthdate}
      <HelpText
        title={texts.helpText.birthdate.title}
        onClick={() => logHelpTextClick(texts.helpText.birthdate.title)}
      >
        <Label>{texts.helpText.birthdate.title}</Label>
        <BodyLong>{texts.helpText.birthdate.text}</BodyLong>
      </HelpText>
    </div>
  );
}

export default function SokPerson() {
  const [initials, setInitials] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const {
    mutate,
    data: searchResults,
    isPending,
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
    return initials === '' || (initials.length <= 4 && initials.length > 1);
  };

  const handleSubmit = () => {
    const parsedBirthdate = parseBirthdate(birthdate);
    const parsedInitials = removePunctuation(initials);
    if (isValidInitials(initials) && !!parsedBirthdate) {
      const requestDTO: SokDTO = {
        initials: parsedInitials.toLowerCase(),
        birthdate: parsedBirthdate,
      };
      mutate(requestDTO, {
        onSuccess: (data) => logSokPersonResults(data.length, requestDTO),
        onSettled: () => logSokPersonEvent(),
      });
    } else {
      setIsFormError(true);
      logSokPersonError({
        birthdate: birthdate,
        isValidBirthdate: !!parsedBirthdate,
        isInvalidBirthdate: parsedBirthdate === null,
        initials: initials,
        isValidInitials: isValidInitials(initials),
        isInvalidInitials: !isValidInitials(initials),
        isError: isError,
      });
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
          <div className="flex gap-2 items-center">
            <Heading level="2" size="medium">
              {texts.header}
            </Heading>
            <HelpText
              title={texts.helpText.info.title}
              onClick={() => logHelpTextClick(texts.helpText.info.title)}
            >
              <Label>{texts.helpText.info.title}</Label>
              <BodyLong>{texts.helpText.info.p1}</BodyLong>
              <BodyLong className="pt-2">{texts.helpText.info.p2}</BodyLong>
            </HelpText>
          </div>
          <VStack gap="4">
            <BodyLong>{texts.info}</BodyLong>
            <div className="grid grid-cols-[auto,auto,auto] gap-x-8 gap-y-2 align-end max-w-max">
              <TextField
                label={<FodselsdatoLabel />}
                description="ddmmåå"
                htmlSize={10}
                type="text"
                onChange={(e) => setBirthdate(e.target.value)}
                error={isInvalidBirthdate}
              />
              <TextField
                label={<InitialerLabel />}
                description="Eks: Oline Nordmann blir ON"
                htmlSize={6}
                type="text"
                onChange={(e) => setInitials(e.target.value)}
                error={isFormError && !isValidInitials(initials)}
              />
              <Button
                loading={isPending}
                icon={<MagnifyingGlassIcon />}
                type="submit"
                className="self-end max-w-max"
              >
                Søk
              </Button>
              {isInvalidBirthdate && (
                <ErrorMessage size="small">
                  {texts.validation.birthdate}
                </ErrorMessage>
              )}
              {isInvalidInitials && (
                <ErrorMessage size="small" className="col-start-2 col-end-4">
                  {texts.validation.initials}
                </ErrorMessage>
              )}
            </div>
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
