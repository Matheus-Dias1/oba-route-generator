type step = {
  step: string;
  limitHeight: boolean;
  limitWidth: boolean;
};

export const workflow: step[] = [
  { step: 'home', limitHeight: true, limitWidth: true },
  { step: 'matcher', limitHeight: false, limitWidth: true },
  { step: 'route-selector', limitHeight: true, limitWidth: true },
  { step: 'route-viewer', limitHeight: false, limitWidth: false },
  { step: 'item-picker', limitHeight: true, limitWidth: true },
  { step: 'finish', limitHeight: true, limitWidth: true },
];
