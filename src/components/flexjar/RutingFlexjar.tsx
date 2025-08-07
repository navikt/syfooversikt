import React, { useEffect, useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
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
  followupQuestion: 'Hva er årsaken til/bakgrunnen for flyttingen?',
  send: 'Send',
  validation: 'Vennligst velg en tilbakemelding',
  success: 'Takk for din tilbakemelding!',
  sporsmal: 'Bruker du Arena til å flytte sykmeldte mellom enheter?',
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
  const [feedback, setFeedback] = useState<string>();
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
      setFeedback('');
    }
    setIsApen(!isApen);
  };

  const handleSubmit = () => {
    if (radioValue) {
      const body: FlexjarFeedbackDTO = {
        feedbackId: side + ' - Ruting',
        feedback: feedback,
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
                <Textarea
                  maxLength={500}
                  minRows={3}
                  size="small"
                  label={
                    <div>
                      <Label>{texts.followupQuestion}</Label>
                      <BodyShort textColor="subtle" size="small">
                        {texts.feedbackLabelDescription}
                      </BodyShort>
                    </div>
                  }
                  value={feedback ?? ''}
                  onChange={(e) => setFeedback(e.target.value)}
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
