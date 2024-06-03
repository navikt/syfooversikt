import React, { useEffect, useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  ErrorMessage,
  Label,
  Radio,
  RadioGroup,
  Textarea,
  UNSAFE_Combobox,
} from '@navikt/ds-react';
import {
  FlexjarFeedbackDTO,
  useFlexjarFeedback,
} from '@/data/flexjar/useFlexjarFeedback';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { defaultErrorTexts } from '@/api/errors';
import { StoreKey, useLocalStorageState } from '@/hooks/useLocalStorageState';
import * as Amplitude from '@/utils/amplitude';
import { EventType } from '@/utils/amplitude';
import styled from 'styled-components';

const texts = {
  apneKnapp: 'Vi ønsker å lære av deg',
  anonym: 'Anonym tilbakemelding',
  feedbackLabelDescription:
    'Ikke skriv inn navn eller andre personopplysninger.',
  feedbackLabel: (svar: string) =>
    svar === 'Ja'
      ? 'Noe annet du bruker Arena til? (valgfritt)'
      : 'Har du noen andre tilbakemeldinger til oss? (valgfritt)',
  send: 'Send',
  validation: 'Vennligst velg en tilbakemelding',
  success: 'Takk for din tilbakemelding!',
  sporsmal: 'Bruker du Arena til daglig i sykefraværsoppfølgingen?',
  labelAlternativer: 'Hva bruker du Arena til? (Velg gjerne flere)',
};

const arenaOptions = [
  '39-ukers oppgave',
  '14a-vurdering',
  'AEV',
  'Historikk på sykmeldt',
  'Dialogmelding',
  'Sende brev fra egen mal',
  'Friskmelding til arbeidsformidling',
  'Tiltak',
  'Be om oppfølgingsplan',
  'Vurdere § 8-4',
  'Vurdere § 8-8 manglende medvirkning',
  'Oppgave fra behandler i sykmeldingen',
  'Oppfølgingsoppgave',
  'Sjekke arbeidsforhold til sykmeldt',
];

const StyledCombobox = styled(UNSAFE_Combobox)`
  .navds-combobox__list {
    max-height: 12rem;
  }
`;

function logPageView(side: string) {
  Amplitude.logEvent({
    type: EventType.PageView,
    data: { url: window.location.href, sidetittel: side + ' - med Flexjar' },
  });
}

enum RadioOption {
  JA = 'Ja',
  NEI = 'Nei',
}

interface FlexjarProps {
  side: string;
}

export const Flexjar = ({ side }: FlexjarProps) => {
  const [isApen, setIsApen] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>();
  const [feedback, setFeedback] = useState<string>();
  const [radioValue, setRadioValue] = useState<RadioOption | null>(null);
  const [comboboxValue, setComboboxValue] = useState<string[]>([]);
  const sendFeedback = useFlexjarFeedback();
  const [, setFeedbackDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_ARENABRUK_FEEDBACK_DATE,
    null
  );

  useEffect(() => {
    logPageView(side);
  }, [side]);

  const toggleApen = () => {
    if (isApen) {
      setRadioValue(null);
      setComboboxValue([]);
      setFeedback('');
    }
    setIsApen(!isApen);
  };

  const updateToggledOptions = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setComboboxValue([...comboboxValue, option]);
    } else {
      setComboboxValue(comboboxValue.filter((val) => val !== option));
    }
  };

  const updateRadioValue = (value: RadioOption) => {
    if (radioValue === null) {
      Amplitude.logEvent({
        type: EventType.OptionSelected,
        data: {
          option: value,
          tekst: 'Radioknapp Flexjar Arena',
          url: window.location.href,
        },
      });
    }
    setRadioValue(value);
  };

  const buildFeedbackString = (): string | undefined => {
    if (radioValue === null) {
      return undefined;
    }
    let s = '';
    if (radioValue === RadioOption.JA) {
      s += `[${comboboxValue.join(', ')}]`;
      s += feedback ? ' - ' + feedback : '';
    } else if (radioValue === RadioOption.NEI && feedback) {
      s += feedback;
    }
    return s;
  };

  const handleSubmit = () => {
    if (radioValue) {
      const feedbackString = buildFeedbackString();
      const body: FlexjarFeedbackDTO = {
        feedbackId: side,
        feedback: feedbackString,
        svar: radioValue,
        app: 'syfooversikt',
      };
      sendFeedback.mutate(body, {
        onSuccess: () => {
          setFeedbackDate(new Date());
          Amplitude.logEvent({
            type: EventType.OptionSelected,
            data: {
              option: radioValue,
              tekst: 'Score Flexjar',
              url: window.location.href,
            },
          });
        },
      });
    } else {
      setIsValid(false);
    }
  };

  return (
    <div className="flex flex-col sticky bottom-0 self-end items-end z-[100]">
      <Button
        variant="primary"
        iconPosition="right"
        icon={isApen ? <ChevronDownIcon /> : <ChevronUpIcon />}
        onClick={toggleApen}
        className="w-max"
      >
        {texts.apneKnapp}
      </Button>
      {isApen && (
        <Box
          background={'surface-default'}
          borderColor="border-default"
          borderWidth="2"
          shadow="large"
          borderRadius="medium"
          padding="4"
          className="flex flex-col gap-4 w-[25rem]"
        >
          {sendFeedback.isSuccess ? (
            <>
              <Label>{texts.sporsmal}</Label>
              <Alert variant="success" size="small">
                {texts.success}
              </Alert>
            </>
          ) : (
            <>
              <RadioGroup
                legend={<Label>{texts.sporsmal}</Label>}
                onChange={(e) => updateRadioValue(e)}
                description={texts.anonym}
                size="small"
              >
                <Radio value={RadioOption.JA}>Ja</Radio>
                <Radio value={RadioOption.NEI}>Nei</Radio>
              </RadioGroup>
              {radioValue === RadioOption.JA && (
                <StyledCombobox
                  label={texts.labelAlternativer}
                  options={arenaOptions}
                  isMultiSelect
                  clearButton={true}
                  onToggleSelected={(option, isSelected) =>
                    updateToggledOptions(option, isSelected)
                  }
                />
              )}
              {!!radioValue && (
                <>
                  <Textarea
                    maxLength={500}
                    minRows={3}
                    size="small"
                    label={
                      <div>
                        <Label>{texts.feedbackLabel(radioValue)}</Label>
                        <BodyShort textColor="subtle" size="small">
                          {texts.feedbackLabelDescription}
                        </BodyShort>
                      </div>
                    }
                    value={feedback ?? ''}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  {isValid === false && (
                    <ErrorMessage size="small">{texts.validation}</ErrorMessage>
                  )}
                  {sendFeedback.isError && (
                    <Alert variant="error" size="small">
                      {defaultErrorTexts.generalError}
                    </Alert>
                  )}
                  <Button
                    variant="primary"
                    className="w-max"
                    onClick={handleSubmit}
                    loading={sendFeedback.isLoading}
                  >
                    {texts.send}
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      )}
    </div>
  );
};
