export const paginate = async (modelQuery, query, options?: {
  where?,
  select?,
  relations?,
}) => {
  const page = query.page || 1
  const limit = query.limit || 10
  const offset = (page - 1) * limit
  const sortOrder = { createdAt: query.orderBy === 'asc' ? 'ASC' : 'DESC' }
  
  const [items, totalCount] = await Promise.all([
    modelQuery.find({
      loadRelationIds: true,
      where: options?.where || {},
      select: options?.select || [],
      relations: options?.relations || [],
      take: limit,
      skip: offset,
      order: sortOrder,
    }),
    modelQuery.count({ where: options?.where || {} }),
  ])
  
  const count = items.length
  const total = totalCount
  const totalPages = Math.ceil(total / limit)

  return {
    items,
    meta: {
      pagination: { page, limit, count, total, totalPages },
    },
  }
}