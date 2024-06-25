import { getProxyByKeys } from "../webpack";

const MegaModule = getProxyByKeys([ "Anchor" ]);

export interface ModalProps {
  transitionState: 0 | 1 | 2 | 3 | 4 | null,
  onClose: () => void
};

export type ModalComponent = (props: ModalProps) => React.ReactNode;

export type ModalOptions = {
  modalKey?: string,
  instant?: boolean,
  onCloseRequest?: Function,
  onCloseCallback?: Function,
  contextKey?: "default" | "popout"
};

let counter = 0;
export function openModal(Component: ModalComponent, options: ModalOptions = {}) {
  options.modalKey ??= `glounza-${counter++}`;

  if (typeof Component !== "function") () => Component;

  MegaModule.openModal((props: ModalProps) => (
    <Component {...props} />
  ), options);

  return {
    close: () => closeModal(options.modalKey!),
    id: options.modalKey
  };
};
export function closeModal(id: string) {  
  MegaModule.closeModal(id);
};
export function closeAllModals() {
  MegaModule.closeAllModals();
};
export function hasModalOpen(id: string) {
  return MegaModule.hasModalOpen(id);
};