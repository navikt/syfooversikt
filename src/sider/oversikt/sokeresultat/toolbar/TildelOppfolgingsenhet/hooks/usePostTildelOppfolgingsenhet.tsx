import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SYFOBEHANDLENDEENHET_ROOT } from '@/apiConstants';
import { post } from '@/api/axios';
import { PersonOversiktStatusDTO } from '@/api/types/personoversiktTypes';
import { personoversiktQueryKeys } from '@/data/personoversiktHooks';
import { useAktivEnhet } from '@/context/aktivEnhet/AktivEnhetContext';

export function usePostTildelOppfolgingsenhet() {
  const queryClient = useQueryClient();
  const { aktivEnhet } = useAktivEnhet();

  const path = `${SYFOBEHANDLENDEENHET_ROOT}/oppfolgingsenhet-tildelinger`;
  const postTildelOppfolgingsenhet = (
    person: OppfolgingsenhetTildelingerRequestDTO
  ) => post<OppfolgingsenhetTildelingerResponseDTO>(path, person);

  return useMutation({
    mutationFn: postTildelOppfolgingsenhet,
    onSuccess: (data: OppfolgingsenhetTildelingerResponseDTO) => {
      const personer: PersonOversiktStatusDTO[] =
        queryClient.getQueryData(
          personoversiktQueryKeys.personoversiktEnhet(aktivEnhet)
        ) || [];

      const updatedPersoner: PersonOversiktStatusDTO[] = personer.filter(
        (person) => {
          const isPersonTildelt = data.tildelinger.find(
            (tildeling) => tildeling.personident === person.fnr
          );
          return !isPersonTildelt;
        }
      );

      queryClient.setQueryData(
        personoversiktQueryKeys.personoversiktEnhet(aktivEnhet),
        updatedPersoner
      );
    },
  });
}

export interface OppfolgingsenhetTildelingerRequestDTO {
  personidenter: string[];
  oppfolgingsenhet: string;
}

export interface OppfolgingsenhetTildelingerResponseDTO {
  tildelinger: OppfolgingsenhetTildeling[];
}

interface OppfolgingsenhetTildeling {
  personident: string;
  oppfolgingsenhet: string;
}
