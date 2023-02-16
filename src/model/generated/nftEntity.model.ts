import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {CollectionEntity} from "./collectionEntity.model"
import {Emote} from "./emote.model"
import {Event} from "./event.model"
import {MetadataEntity} from "./metadataEntity.model"
import {Resource} from "./resource.model"

@Entity_()
export class NFTEntity {
    constructor(props?: Partial<NFTEntity>) {
        Object.assign(this, props)
    }

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    blockNumber!: bigint | undefined | null

    @Column_("bool", {nullable: false})
    burned!: boolean

    @Index_()
    @ManyToOne_(() => CollectionEntity, {nullable: true})
    collection!: CollectionEntity

    @Column_("timestamp with time zone", {nullable: false})
    createdAt!: Date

    @Index_()
    @Column_("text", {nullable: true})
    currentOwner!: string | undefined | null

    @Index_()
    @ManyToOne_(() => NFTEntity, {nullable: true})
    parent!: NFTEntity | undefined | null

    @OneToMany_(() => Emote, e => e.nft)
    emotes!: Emote[]

    @OneToMany_(() => Event, e => e.nft)
    events!: Event[]

    @Index_({unique: true})
    @Column_("text", {nullable: false})
    hash!: string

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    instance!: string | undefined | null

    @Column_("text", {nullable: true})
    issuer!: string | undefined | null

    @Index_()
    @ManyToOne_(() => MetadataEntity, {nullable: true})
    meta!: MetadataEntity | undefined | null

    @Column_("text", {nullable: true})
    metadata!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    price!: bigint

    @Column_("text", {nullable: true})
    sn!: string | undefined | null

    @Column_("int4", {nullable: true})
    transferable!: number | undefined | null

    @Column_("numeric", {transformer: marshal.floatTransformer, nullable: true})
    royalty!: number | undefined | null

    @Column_("timestamp with time zone", {nullable: false})
    updatedAt!: Date

    @Column_("text", {nullable: false})
    version!: string

    @Column_("int4", {nullable: false})
    emoteCount!: number

    @Column_("bool", {nullable: false})
    pending!: boolean

    @OneToMany_(() => Resource, e => e.nft)
    resources!: Resource[]
}
