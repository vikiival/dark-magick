import { unwrap } from '../utils/extract'
import { getCreateBase } from './getters'
import { Base, Context } from '../utils/types'
import { Optional } from '@kodadot1/metasquid/types'
import logger, { logError } from '../utils/logger'
import { plsBe, real } from '@kodadot1/metasquid/consolidator'
import { createUnlessNotExist } from '../utils/verbose'
import { CollectionEntity } from '../../model'



export async function base(context: Context) {
  let base: Optional<Base> = undefined
  try {
    const { value, caller, timestamp, blockNumber, version } = unwrap(context, getCreateBase);
    base = value
    const final = await createUnlessNotExist('', CollectionEntity, context);
    final.issuer = caller
    final.currentOwner = caller
    final.symbol = base.symbol.trim()
    // final.type = base.type
    // final.themes = base.themes
    // final.parts = base.parts

    plsBe<string>(real, '')
  } catch (e) {
    logError(e, (e) =>
      logger.error(`[COLLECTION] ${e.message}, ${JSON.stringify(base)}`)
    )
  }
  

}
