import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { findByIdList, getOrFail as get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { assertNotNull } from '@subsquid/substrate-processor'
import { Resadd, SetPriority } from '@vikiival/minimark/v2'

import { NFTEntity, Resource } from '../../model'
import { handleMetadata } from '../shared'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getSetPriority } from './getters'

const OPERATION = Action.SETPRIORITY

export async function setPriority(context: Context) {
  let interaction: Optional<SetPriority> = null

  try {
    const getter = getSetPriority
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getter);
    const nft = await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    logger.success(`[${OPERATION}] NEW PRIORITY ${interaction.value} for ${nft.id} from ${caller}`)

    const resourceList = await findByIdList(context.store, Resource, interaction.value)
    
    if (resourceList.length !== interaction.value.length) {
      throw new Error(`[${OPERATION}] Resource list length mismatch need ${resourceList.length} got ${interaction.value.length}`)
    }

    resourceList.forEach((resource) => {
      resource.priority = interaction.value.indexOf(resource.id)
    })

  
    await context.store.save(resourceList)
    await context.store.save(nft)
    logger.success(`[${OPERATION}] ${nft.id} from ${caller}`)
    await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.at(0)}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

