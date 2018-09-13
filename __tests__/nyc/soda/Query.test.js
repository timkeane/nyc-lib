import Query from 'nyc/soda/Query'

const options = {
    url: 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv',
    appToken: 'NwNjHSDEkdJ2mvFMm1zSNrNAf',
    query:
    {
        select: 'count(unique_key) AS sr_count, community_board, complaint_type',
        // where: x_coordinate_state_plane IS NOT NULL AND y_coordinate_state_plane IS NOT NULL AND community_board NOT IN ('QNA',+'Unspecified+MANHATTAN',+'Unspecified+BRONX',+'Unspecified+BROOKLYN',+'Unspecified+QUEENS',+'Unspecified+STATEN+ISLAND',+'0+Unspecified') AND created_date+>=+'2018-09-05'+AND+created_date+<=+'2018-09-12'+AND+community_board+=+'17+BROOKLYN'+AND+complaint_type+IN+('Noise+-+Residential')&
        group: 'community_board, complaint_type',
        order: 'sr_count DESC'
    },
    filters: {}
}


describe('constructor', () => {
  const setFilters = Query.prototype.setFilters
  beforeEach(() => {
      Query.prototype.setFilters = jest.fn()
  })
  afterEach(() => {
      Query.prototype.setFilters = setFilters
  })
  test('constructor', () => {
    expect.assertions(6)
    const query = new Query(options)
    expect(query instanceof Query).toBe(true)
    expect(query.url).toBe(options.url)
    expect(query.appToken).toBe(options.appToken)
    expect(query.query).toBe(options.query)
    expect(query.setFilters).toHaveBeenCalledTimes(1)
    expect(query.setFilters.mock.calls[0][0]).toBe(options.filters)
  })
})


describe('setters', () => {
  test('setQuery', () => {
    expect.assertions(30)
    const query = new Query(options)
    let params = {
        select: 'changed-select-1',
        where: 'changed-where-1',
        group: 'changed-group-1',
        order: 'changed-order-1',
        limit: 5
    }
    query.setQuery(params)
    expect(query.query.select).toBe('changed-select-1')
    expect(query.query.where).toBe('changed-where-1')
    expect(query.query.group).toBe('changed-group-1')
    expect(query.query.order).toBe('changed-order-1')
    expect(query.query.limit).toBe(5)
  
    params = {
        select: 'changed-select-2'
    }
    query.setQuery(params)
    expect(query.query.select).toBe('changed-select-2')
    expect(query.query.where).toBe('changed-where-1')
    expect(query.query.group).toBe('changed-group-1')
    expect(query.query.order).toBe('changed-order-1')
    expect(query.query.limit).toBe(5)
  
    params = {
        where: 'changed-where-2'
    }
    query.setQuery(params)
    expect(query.query.where).toBe('changed-where-2')
    expect(query.query.select).toBe('changed-select-2')
    expect(query.query.group).toBe('changed-group-1')
    expect(query.query.order).toBe('changed-order-1')
    expect(query.query.limit).toBe(5)
  
    params = {
        group: 'changed-group-2'
    }
    query.setQuery(params)
    expect(query.query.group).toBe('changed-group-2')
    expect(query.query.where).toBe('changed-where-2')
    expect(query.query.select).toBe('changed-select-2')
    expect(query.query.order).toBe('changed-order-1')
    expect(query.query.limit).toBe(5)
  
    params = {
        order: 'changed-order-2'
    }
    query.setQuery(params)
    expect(query.query.order).toBe('changed-order-2')
    expect(query.query.where).toBe('changed-where-2')
    expect(query.query.select).toBe('changed-select-2')
    expect(query.query.group).toBe('changed-group-2')
    expect(query.query.limit).toBe(5)
  
    params = {
        limit: 10
    }
    query.setQuery(params)
    expect(query.query.limit).toBe(10)
    expect(query.query.where).toBe('changed-where-2')
    expect(query.query.group).toBe('changed-group-2')
    expect(query.query.order).toBe('changed-order-2')
    expect(query.query.select).toBe('changed-select-2')
  })
  
  test('setAppToken', () => {
    expect.assertions(1)
    const query = new Query(options)
    const appToken = 'changed-appToken'

    query.setAppToken(appToken)
    expect(query.appToken).toBe('changed-appToken')
  
  })
  
  test('setUrl', () => {
    expect.assertions(1)
    const query = new Query(options)
    const url = 'changed-url'

    query.setUrl(url)
    expect(query.url).toBe('changed-url')
  
	})
	
  test('setFilter', () => {
    expect.assertions(1)
    const query = new Query(options)
    query.filters = {}
    const field = 'mock-field'
    const filter = 'mock-filter'
    query.setFilter(field, filter)
    expect(query.filters[field]).toEqual([filter])
        
	})
	
	test('setFilters', () => {
		expect.assertions(1)
		const query = new Query(options)
		query.filters = {}
		const field = 'mock-field'
		const filter = ['mock-filter1', 'mock-filter2']
		const filters = {
			field: field,
			filter: filter
		}
		query.setFilters(filters)
		expect(query.filters).toBe(filters)

	})
    
})

test('addFilter', () => {
	expect.assertions(2)
  const query = new Query(options)

  let field = 'mock-field-1'
	let filter = 'mock-filter-1'
	let filtersArray = []

	filtersArray.push(filter)
  query.addFilter(field, filter)
	expect(query.filters[field]).toEqual(filtersArray)
	
  field = 'mock-field-1'
	filter = 'mock-filter-2'
	
	filtersArray.push(filter)
  query.addFilter(field, filter)
	expect(query.filters[field]).toEqual(filtersArray)	
})

test('clearFilters', () => {
	expect.assertions(1)
	const query = new Query(options)

	let field = 'mock-field'
	let filter = 'mock-filter'
	query.addFilter(field, filter)
	
	query.clearFilters('mock-field')
	expect(query.filters[field]).toBeUndefined()

})

test('clearAllFilters', () => {
	expect.assertions(1)
	const query = new Query(options)

	let field = 'mock-field'
	let filter = 'mock-filter'
	query.addFilter(field, filter)
	
	query.clearAllFilters()
	expect(query.filters).toEqual({})

})

