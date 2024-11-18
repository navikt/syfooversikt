import React, { useState } from 'react';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  TextField,
  VStack,
} from '@navikt/ds-react';
import { useSokPerson } from '@/data/personoversiktHooks';
import { SokDTO } from '@/api/types/sokDTO';
import SokPersonResultat from '@/components/sokperson/SokPersonResultat';
import { MagnifyingGlassIcon } from '@navikt/aksel-icons';
import { isNumeric, removePunctuation } from '@/utils/stringUtil';
import { parseDateString } from '@/utils/dateUtils';

const texts = {
  buttonText: 'Søk etter sykmeldt',
  header: 'Søk etter sykmeldt',
  info:
    'Her kan du søke opp sykmeldte personer basert på initialer og fødselsdato.',
  validation: {
    initials: 'Vennligst angi gyldige initialer',
    birthdate: 'Vennligst angi en gyldig fødselsdato',
  },
  error: 'Noe gikk galt under søket. Vennligst prøv igjen.',
};

export default function SokPerson() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [nameInitials, setNameInitials] = useState<string>('');
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

  const validInitials = (initials: string): boolean => {
    return initials.length <= 3 && initials.length > 1;
  };

  const handleSubmit = () => {
    const parsedBirthdate = parseBirthdate(birthdate);
    if (validInitials(nameInitials) && !!parsedBirthdate) {
      const requestDTO: SokDTO = {
        initials: nameInitials.toLowerCase(),
        birthdate: parsedBirthdate,
      };
      mutate(requestDTO);
    } else {
      setIsFormError(true);
    }
  };

  return (
    <Box>
      <Button onClick={() => setIsModalOpen(true)} size="small">
        {texts.buttonText}
      </Button>
      <Modal
        closeOnBackdropClick
        className="w-[90%] max-w-[90%]"
        open={isModalOpen}
        aria-label={texts.buttonText}
        onClose={() => setIsModalOpen(false)}
      >
        <Modal.Header>
          <Heading level="2" size="medium">
            {texts.header}
          </Heading>
        </Modal.Header>
        <Modal.Body>
          <VStack gap="4">
            <BodyShort>{texts.info}</BodyShort>
            <HStack gap="8" align="end">
              <TextField
                label="Initialer"
                description="AB"
                htmlSize={10}
                type="text"
                onChange={(e) => setNameInitials(e.target.value)}
                error={
                  isFormError && !validInitials(nameInitials)
                    ? texts.validation.initials
                    : undefined
                }
              />
              <TextField
                label="Fødselsdato"
                description="ddmmåå"
                htmlSize={14}
                type="text"
                onChange={(e) => setBirthdate(e.target.value)}
                error={
                  isFormError && parseBirthdate(birthdate) === null
                    ? texts.validation.birthdate
                    : undefined
                }
              />
              <Button
                onClick={handleSubmit}
                loading={isLoading}
                icon={<MagnifyingGlassIcon />}
                type="submit"
              >
                Søk
              </Button>
            </HStack>
            {searchResults && isSuccess && (
              <SokPersonResultat sokeresultater={searchResults} />
            )}
            {isError && (
              <Alert variant="error" size="small">
                {texts.error}
              </Alert>
            )}
          </VStack>
        </Modal.Body>
      </Modal>
    </Box>
  );
}
