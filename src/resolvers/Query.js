function feed(parent, args, context, info) {
    const where = args.filter
        ? {
            OR: [
            { url_contains: args.filter },
            { description_contains: args.filter },
            ],
        }
        : {}
    const queriedLinks = await context.db.query.links(
        { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
        `{ id }`,
    )
    
    // 2
    const countSelectionSet = `
    {
        aggregate {
        count
        }
    }
    `

    const linksConnection = await context.db.query.linksConnection({}, countSelectionSet)

    // 3
    return {
    count: linksConnection.aggregate.count,
    linkIds: queriedLinks.map(link => link.id),
    }

    // return context.db.query.links(
    //     { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    //     info,
    // )
}

function link(root, { id }) {
    return context.db.query.links({ id: id }, info)
}

module.exports = {
    feed,
    link
}