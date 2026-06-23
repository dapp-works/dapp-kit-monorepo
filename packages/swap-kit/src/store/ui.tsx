import type { ComponentType } from 'react';
import type { ERC20 } from '../contracts/erc20';

/**
 * UI components the app injects so the engine can open dialogs without owning
 * the component library. Call setSwapUI() once at app init (see Phase 2 wiring).
 */
export interface SwapUIComponents {
  SettingModal: ComponentType<any>;
  ImportTokenModal: ComponentType<any>;
}

export const SwapUI: { components: SwapUIComponents | null } = { components: null };

export function setSwapUI(components: SwapUIComponents) {
  SwapUI.components = components;
}

/**
 * Runtime config the app injects (replaces process.env reads inside the engine).
 * Call setSwapConfig() once at app init.
 */
export interface SwapRuntimeConfig {
  /** Quote API endpoint, e.g. https://swap-api.mimo.exchange/api/trade */
  quoteApiUrl: string;
}

export const SwapConfig: { value: SwapRuntimeConfig } = {
  value: { quoteApiUrl: '' },
};

export function setSwapConfig(config: Partial<SwapRuntimeConfig>) {
  SwapConfig.value = { ...SwapConfig.value, ...config };
}
