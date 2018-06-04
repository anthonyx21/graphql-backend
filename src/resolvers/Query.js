function feed(parent, args, context, info) {
    return context.db.query.links({}, info)
}

function link(root, { id }) {
    return context.db.query.links({ id: id }, info)
}

module.exports = {
    feed,
    link
}