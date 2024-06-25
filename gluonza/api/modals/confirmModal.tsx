import { openModal } from "./actions";
import { getProxyByKeys } from "../webpack";
import { I18n } from "../webpack/common";
import { transformContent } from "../../markdown";

const MegaModule = getProxyByKeys([ "Anchor" ]);

export type ConfirmModalOptions = {
  confirmText?: string,
  onConfirm?(): void,
  cancelText?: string,
  onCancel?(): void,
  onCloseCallback?(): void,
  onCloseRequest?(closedFromButton: boolean): boolean,
  danger?: boolean,
  contextKey?: "default" | "popout"
};

export function openConfirmModal(title: React.ReactNode, content: React.ReactNode | React.ReactNode[], options: ConfirmModalOptions = {}) {
  function dummy() { };
  const {
    confirmText = I18n.Messages.OKAY,
    onConfirm = dummy,
    cancelText = I18n.Messages.CANCEL,
    onCancel = dummy,
    onCloseCallback = dummy,
    onCloseRequest = () => true,
    danger = false,
    contextKey
  } = options;

  let closedFromButton = false;
  
  const modal = openModal((props) => (
    <MegaModule.ConfirmModal
      header={title}
      className="vx-modals-confirm-modal"
      confirmText={confirmText}
      onConfirm={() => {
        onConfirm();
        if (onCloseRequest(true))
          modal.close();
        closedFromButton = true;
      }}
      cancelText={cancelText}
      onCancel={() => {
        onCancel();
        if (onCloseRequest(true))
          modal.close();
        closedFromButton = true;
      }}
      confirmButtonColor={danger ? MegaModule.Button.Colors.RED : MegaModule.Button.Colors.BRAND}
      transitionState={props.transitionState}
      onClose={() => {}}
    >
      {transformContent(content, "vx-modal-line")}
    </MegaModule.ConfirmModal>
  ), {
    contextKey,
    onCloseCallback() {
      if (!closedFromButton) onCloseCallback();
    },
    onCloseRequest() {
      if (onCloseRequest(false))
        modal.close();
    }
  });

  return modal;
};