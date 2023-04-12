import { plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import md5 from 'md5'

import { CollectionEntity } from '../../model'
import { unwrap } from '../utils/extract'
import { getCreateCollection } from '../utils/getters'
import { error, success } from '../utils/logger'
import { Action, Collection, Context } from '../utils/types'
import { handleMetadata } from '../shared/metadata'

const OPERATION = Action.CREATE

export async function createCollection(context: Context): Promise<void> {
  let collection: Optional<Collection>
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateCollection)
    collection = value
    plsBe<string>(real, collection.id)
    const entity = await get<CollectionEntity>(context.store, CollectionEntity, collection.id)
    plsNotBe<CollectionEntity>(real, entity as CollectionEntity)

    const final = create<CollectionEntity>(CollectionEntity, collection.id, {})

    final.name = collection.name.trim()
    final.max = Number(collection.max) || 0
    final.issuer = caller
    final.currentOwner = caller
    final.symbol = collection.symbol.trim()
    final.blockNumber = BigInt(blockNumber)
    final.metadata = collection.metadata
    final.createdAt = timestamp
    final.version = version
    final.updatedAt = timestamp
    final.nftCount = 0
    final.supply = 0
    final.hash = md5(collection.id)

    if (final.metadata) {
      const metadata = await handleMetadata(final.metadata, final.name, context.store)
      final.meta = metadata
      final.image = metadata?.image
      final.media = metadata?.animationUrl
    }

    success(OPERATION, final.id)
    await context.store.save(final)
  } catch (e) {
    error(e, OPERATION, JSON.stringify(collection))
  }
}