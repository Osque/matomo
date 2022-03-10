/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import { reactive, computed, readonly } from 'vue';
import { AjaxHelper, lazyInitSingleton } from 'CoreHome';

interface FireLimit {
  id: string;
  name: string;
}

interface AvailableFireLimitStoreState {
  fireLimits: FireLimit[];
  isLoading: boolean;
}

class AvailableFireLimitStore {
  private privateState = reactive<AvailableFireLimitStoreState>({
    fireLimits: [],
    isLoading: false,
  });

  private state = computed(() => readonly(this.privateState));

  readonly isLoading = computed(() => this.state.value.isLoading);

  readonly fireLimits = computed(() => this.state.value.fireLimits);

  readonly fireLimitsOptions = computed(() => this.fireLimits.value.map(
    ({ id, name }) => ({ key: id, value: name }),
  ));

  constructor() {
    this.fetchAvailableComparisons();
  }

  private fetchAvailableComparisons() {
    this.privateState.isLoading = true;
    AjaxHelper.fetch<FireLimit[]>({
      method: 'TagManager.getAvailableTagFireLimits',
      filter_limit: '-1',
    }).then((fireLimits) => {
      this.privateState.fireLimits = fireLimits;
    }).finally(() => {
      this.privateState.isLoading = false;
    });
  }
}

export default lazyInitSingleton(AvailableFireLimitStore) as AvailableFireLimitStore;
