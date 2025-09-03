import React, { useEffect, useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Label,
  Radio,
  RadioGroup,
  Textarea,
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

const texts = {
  apneKnapp: 'Flytter du sykmeldte mellom enheter?',
  anonym: 'Anonym tilbakemelding',
  feedbackLabelDescription:
    'Ikke skriv inn navn eller andre personopplysninger.',
  followupQuestion:
    'Hva er årsaken til/bakgrunnen for flyttingen? (Velg en eller flere)',
  utdypendeAnnet: 'Kan du si noe om "Annet"?',
  utdypendeAnnenIntern: 'Kan du si noe om "Annen intern organisering"?',
  send: 'Send',
  validation: 'Vennligst velg en tilbakemelding',
  success: 'Takk for din tilbakemelding!',
  sporsmal: 'Bruker du Arena til å flytte sykmeldte mellom enheter?',
};

const checkboxValue = {
  brukerFlyttet: 'brukerFlyttet',
  navUtland: 'navUtland',
  virksomhetsorganisering: 'virksomhetsorganisering',
  annenIntern: 'annenIntern',
  annet: 'annet',
};

const checkboxValueToLabel: {
  [key: string]: string;
} = {
  [checkboxValue.brukerFlyttet]: 'Bruker har flyttet',
  [checkboxValue.navUtland]: 'Tilhører Nav utland',
  [checkboxValue.virksomhetsorganisering]: 'Virksomhetsorganisering',
  [checkboxValue.annenIntern]: 'Annen intern organisering',
  [checkboxValue.annet]: 'Annet',
};

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

interface Props {
  side: string;
}

export default function RutingFlexjar({ side }: Props) {
  const [isApen, setIsApen] = useState<boolean>(true);
  const [annet, setAnnet] = useState<string>();
  const [
    annenInternOrganisering,
    setAnnenInternOrganisering,
  ] = useState<string>();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [radioValue, setRadioValue] = useState<RadioOption | null>(null);
  const sendFeedback = useFlexjarFeedback();
  const [, setFeedbackDate] = useLocalStorageState<Date | null>(
    StoreKey.FLEXJAR_RUTING_FEEDBACK_DATE,
    null
  );

  useEffect(() => {
    logPageView(side);
  }, [side]);

  const toggleApen = () => {
    if (isApen) {
      setRadioValue(null);
      setAnnet('');
      setAnnenInternOrganisering('');
      setSelectedCheckboxes([]);
    }
    setIsApen(!isApen);
  };

  const utdypendeSvar = (): string => {
    const annen = annenInternOrganisering
      ? `${
          checkboxValueToLabel[checkboxValue.annenIntern]
        }: ${annenInternOrganisering}`
      : '';
    const annetSvar = annet
      ? `${checkboxValueToLabel[checkboxValue.annet]}: ${annet}`
      : '';
    const utdypendeSvar = [annen, annetSvar]
      .filter((value) => value)
      .map((value) => `{${value}}`)
      .join(', ');
    return utdypendeSvar !== '' ? ` - [${utdypendeSvar}]` : '';
  };

  const handleSubmit = () => {
    const selectedValues = selectedCheckboxes
      .map((valg) => checkboxValueToLabel[valg])
      .join(', ');
    const feedbackString =
      radioValue === RadioOption.JA
        ? `[${selectedValues}]${utdypendeSvar()}`
        : undefined;
    if (radioValue) {
      const body: FlexjarFeedbackDTO = {
        feedbackId: side + ' - Ruting',
        feedback: feedbackString,
        svar: radioValue,
        app: 'syfooversikt',
      };
      sendFeedback.mutate(body, {
        onSuccess: () => setFeedbackDate(new Date()),
      });
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
                onChange={(e) => setRadioValue(e)}
                description={texts.anonym}
                size="small"
              >
                <Radio value={RadioOption.JA}>Ja</Radio>
                <Radio value={RadioOption.NEI}>Nei</Radio>
              </RadioGroup>

              {radioValue === RadioOption.JA && (
                <CheckboxGroup
                  legend={texts.followupQuestion}
                  onChange={(vals) => setSelectedCheckboxes(vals)}
                >
                  <Checkbox size="small" value={checkboxValue.brukerFlyttet}>
                    {checkboxValueToLabel[checkboxValue.brukerFlyttet]}
                  </Checkbox>
                  <Checkbox size="small" value={checkboxValue.navUtland}>
                    {checkboxValueToLabel[checkboxValue.navUtland]}
                  </Checkbox>
                  <Checkbox
                    size="small"
                    value={checkboxValue.virksomhetsorganisering}
                  >
                    {
                      checkboxValueToLabel[
                        checkboxValue.virksomhetsorganisering
                      ]
                    }
                  </Checkbox>
                  <Checkbox size="small" value={checkboxValue.annenIntern}>
                    {checkboxValueToLabel[checkboxValue.annenIntern]}
                  </Checkbox>
                  <Checkbox size="small" value={checkboxValue.annet}>
                    {checkboxValueToLabel[checkboxValue.annet]}
                  </Checkbox>
                </CheckboxGroup>
              )}

              {selectedCheckboxes.includes(checkboxValue.annenIntern) && (
                <Textarea
                  maxLength={500}
                  minRows={3}
                  size="small"
                  label={
                    <div>
                      <Label>{texts.utdypendeAnnenIntern}</Label>
                      <BodyShort textColor="subtle" size="small">
                        {texts.feedbackLabelDescription}
                      </BodyShort>
                    </div>
                  }
                  value={annenInternOrganisering ?? ''}
                  onChange={(e) => setAnnenInternOrganisering(e.target.value)}
                />
              )}

              {selectedCheckboxes.includes(checkboxValue.annet) && (
                <Textarea
                  maxLength={500}
                  minRows={3}
                  size="small"
                  label={
                    <div>
                      <Label>{texts.utdypendeAnnet}</Label>
                      <BodyShort textColor="subtle" size="small">
                        {texts.feedbackLabelDescription}
                      </BodyShort>
                    </div>
                  }
                  value={annet ?? ''}
                  onChange={(e) => setAnnet(e.target.value)}
                />
              )}

              {!!radioValue && (
                <>
                  {sendFeedback.isError && (
                    <Alert variant="error" size="small">
                      {defaultErrorTexts.generalError}
                    </Alert>
                  )}
                  <Button
                    variant="primary"
                    className="w-max"
                    onClick={handleSubmit}
                    loading={sendFeedback.isPending}
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
}
