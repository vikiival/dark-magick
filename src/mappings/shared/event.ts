import { create } from '@kodadot1/metasquid/entity'
import { BaseCall, Store } from '@kodadot1/metasquid/types'

import { Event, Interaction, NFTEntity } from '../../model'
import { eventId } from '../utils/helper'
import logger, { logError } from '../utils/logger'
import { eventFrom } from '../utils/types'

export async function createEvent(final: NFTEntity, interaction: Interaction, call: BaseCall, meta: string, store: Store, currentOwner?: string) {
  try {
    const newEventId = eventId(final.id, interaction)
    const event = create<Event>(Event, newEventId, eventFrom(interaction, call, meta, currentOwner))
    event.nft = final
    await store.save(event)
  } catch (e) {
    logError(e, (e) => logger.warn(`[[${interaction}]]: ${final.id} Reason: ${e.message}`))
  }
  
}