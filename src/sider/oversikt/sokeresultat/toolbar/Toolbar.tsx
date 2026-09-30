import TildelVeilederButton from "./TildelVeileder/TildelVeilederButton";
import TildelVeilederModal from "./TildelVeileder/TildelVeilederModal";
import React, { useRef, useState } from "react";
import PaginationContainer, {
  PAGINATED_NUMBER_OF_ITEMS,
} from "@/sider/oversikt/sokeresultat/toolbar/PaginationContainer";
import TildelOppfolgingsenhetModal from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetModal";
import TildelOppfolgingsenhetButton from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/TildelOppfolgingsenhetButton";
import { useGetFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import PaginationLabel from "@/sider/oversikt/sokeresultat/toolbar/TildelOppfolgingsenhet/PaginationLabel";
import { Alert } from "@navikt/ds-react";

export interface FeedbackNotification {
  type: "success" | "warning" | "error";
  text: string;
}

export interface Props {
  numberOfItemsTotal: number;
  onPageChange: (startItem: number, endItem: number) => void;
  selectedPersoner: string[];
  setSelectedPersoner: (personer: string[]) => void;
}

export interface PageInfoType {
  firstVisibleIndex: number;
  lastVisibleIndex: number;
}

export default function Toolbar(props: Props) {
  const { toggles } = useGetFeatureToggles();
  const [pageInfo, setPageInfo] = useState<PageInfoType>({
    firstVisibleIndex: 0,
    lastVisibleIndex: PAGINATED_NUMBER_OF_ITEMS,
  });
  const [tableFeedbackNotification, setTableFeedbackNotification] = useState<
    FeedbackNotification | undefined
  >();
  const modalRef = useRef<HTMLDialogElement>(null);
  const tildelVeilederModalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <PaginationLabel
        pageInfo={pageInfo}
        numberOfItemsTotal={props.numberOfItemsTotal}
        selectedPersoner={props.selectedPersoner}
      />
      <div className="sticky top-0 z-[2] flex flex-col rounded-ax-4 border border-ax-border-neutral-subtle bg-ax-bg-default shadow-ax-dialog">
        <section className="flex flex-row items-center justify-between">
          <div className="flex items-center p-2 gap-2">
            <TildelVeilederButton
              modalRef={tildelVeilederModalRef}
              selectedPersoner={props.selectedPersoner}
              setTableFeedbackNotification={setTableFeedbackNotification}
            />
            <TildelVeilederModal
              ref={tildelVeilederModalRef}
              selectedPersoner={props.selectedPersoner}
              setSelectedPersoner={props.setSelectedPersoner}
            />
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetButton
                modalRef={modalRef}
                selectedPersoner={props.selectedPersoner}
                setTableFeedbackNotification={setTableFeedbackNotification}
              />
            )}
            {toggles.isTildelOppfolgingsenhetEnabled && (
              <TildelOppfolgingsenhetModal
                ref={modalRef}
                selectedPersoner={props.selectedPersoner}
                setSelectedPersoner={props.setSelectedPersoner}
                setTableFeedbackNotification={setTableFeedbackNotification}
              />
            )}
          </div>
          <PaginationContainer
            numberOfItemsTotal={props.numberOfItemsTotal}
            onPageChange={props.onPageChange}
            setPageInfo={setPageInfo}
          />
        </section>
        {!!tableFeedbackNotification && (
          <Alert
            variant={tableFeedbackNotification.type}
            size="small"
            className="m-1"
          >
            {tableFeedbackNotification.text}
          </Alert>
        )}
      </div>
    </>
  );
}
