import Query from 'nyc/soda/Query'
import Papa from 'papaparse'

let options
beforeEach(() => {
	options = {
    url: 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv',
    appToken: 'NwNjHSDEkdJ2mvFMm1zSNrNAf',
    query:
    {
        select: 'count(unique_key) AS sr_count, community_board, complaint_type',
        where: '',
        group: 'community_board, complaint_type',
        order: 'sr_count DESC'
    },
    filters: {}
	}
	fetch.resetMocks()
})

const csv = 'col0,col1,col2\ndata00,data01,data02\ndata10,data11,data12'
const json = '{"rows":[{"col0":"data00","col1":"data01","col2":"data02"},{"col0":"data10","col1":"data11","col2":"data12"}]}'


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
		expect.assertions(40)
		
		
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
        

    params = {}
		query.setQuery(params)
		expect(query.query.limit).toBe(10)
    expect(query.query.where).toBe('changed-where-2')
    expect(query.query.group).toBe('changed-group-2')
    expect(query.query.order).toBe('changed-order-2')
		expect(query.query.select).toBe('changed-select-2')

		
		delete query.query.limit
		delete query.query.where
		delete query.query.group
		delete query.query.order
		delete query.query.select
		
		query.setQuery(params)

		expect(query.query.limit).toBe('')
		expect(query.query.where).toBe('')
		expect(query.query.group).toBe('')
		expect(query.query.order).toBe('')
		expect(query.query.select).toBe('*')

		query.clearAllFilters()

  })
	
  test('setAppToken', () => {
    expect.assertions(2)
    const query = new Query(options)
    const appToken = 'changed-appToken'

    query.setAppToken(appToken)
    expect(query.appToken).toBe('changed-appToken')

    query.setAppToken()
    expect(query.appToken).toBe('changed-appToken')
  
  })
  
  test('setUrl', () => {
    expect.assertions(2)
    const query = new Query(options)
    const url = 'changed-url'

    query.setUrl(url)
    expect(query.url).toBe('changed-url')

    query.setUrl()
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
		const filters = {
			'mock-field1': ['mock-filter1', 'mock-filter2'],
			'mock-field2': ['mock-filterA', 'mock-filterB']
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
	expect.assertions(2)
	const query = new Query(options)

	query.filters = {
		'mock-field1' : ['mock-filter1'],
		'mock-field2' : ['mock-filter2']
	}
	
	query.clearFilters('mock-field1')
	expect(query.filters['mock-field1']).toBeUndefined()
	expect(query.filters['mock-field2']).toEqual(['mock-filter2'])

})

test('clearAllFilters', () => {
	expect.assertions(1)
	const query = new Query(options)

	query.filters = {
		'mock-field1' : ['mock-filter1'],
		'mock-field2' : ['mock-filter2']
	}
	
	query.clearAllFilters()
	expect(query.filters).toEqual({})

})

test('appendFilter', () => {	
	expect.assertions(6)
	const query = new Query(options)

	query.clearAllFilters()
	let where = 'where-clause'
	let field = 'field'
	let op = 'filter-op'

	let filterVal1 = "fValue"
	let nullVal = ''

	expect(query.appendFilter(where,field,{
		op: op,
		value: nullVal
	} )).toBe("where-clause AND field FILTER-OP NULL")

    nullVal = "null"
	expect(query.appendFilter(where,field,{
		op: op,
		value: nullVal
	} )).toBe("where-clause AND field FILTER-OP NULL")
	
	expect(query.appendFilter(where,field,{
		op: op,
		value: filterVal1
	} )).toBe("where-clause AND field FILTER-OP 'fValue'")
	
	let filterVal2 = 1
	expect(query.appendFilter(where,field, {
		op: op,
		value: filterVal2
	} )).toBe("where-clause AND field FILTER-OP " + 1)

	let filterValNum = [1, 2]
	expect(query.appendFilter(where,field, {
		op: op,
		value: filterValNum
	} )).toBe("where-clause AND field FILTER-OP (" + 1 + ', ' + 2 + ')')

	let filterVal3 = ['val1', 'val2']
	expect(query.appendFilter(where,field, {
		op: op,
		value: filterVal3
	} )).toBe("where-clause AND field FILTER-OP ('val1', 'val2')")
})

test('getUrlAndQuery', () => {	
	expect.assertions(1)
    const options2 = {
        url: 'url',
        query: {
            select: 'select',
            where: 'where',
            group: 'group',
            order: 'order',
            limit: 'limit'                   
        }
    }
    const query = new Query(options2)
    query.clearAllFilters()
    
    const url = `${options2.url}`
    let qstr = ''
	
    Object.keys(options2.query).forEach((param, index) => {
        let token = index < Object.keys(options2.query).length - 1 ? '&' : ''
        qstr+=`${encodeURIComponent('$')}${param}=${options2.query[param]}${token}`
		})
		
    const urlAndQuery = `${url}?${qstr}`
    query.setUrl(options2.url)
    query.setQuery(options2.query)

    expect(query.getUrlAndQuery()).toEqual(urlAndQuery)
})

test('qstr', () =>{
	console.warn(options.filters);
	
    expect.assertions(1)
    let qstring
    let url = 'url'
    const qOptions = {
        appToken: 'appToken-id',
        query:
        {
            select: 'select-clause',
            where:  'where-clause',
            group: 'group-clause',
            order: 'order-clause'
        },
				filters: {}

    }

		let v = "'VALUE'"
    const qArr = {
        
        $select: 'select-clause',
        $where:  'where-clause AND fieldname FILTER-OP '+"'VALUE'",
        $group: 'group-clause',
        $order: 'order-clause',
        filters: {
				},
        $$app_token: 'appToken-id'

		}
		
    qstring = `${$.param(qArr)}`
		const query = new Query(qOptions)
		query.addFilter('fieldname',{
			op: 'FILTER-OP',
			value: 'VALUE'
		})
		expect(query.qstr()).toEqual(qstring)

})

test('execute csv', done => {    
	expect.assertions(3)

	fetch.mockResponseOnce(csv)

	const query = new Query(options)

	const promise = query.execute(options)

	expect(fetch).toHaveBeenCalledTimes(1)
	expect(fetch.mock.calls[0][0]).toEqual("https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?%24select=count(unique_key)%20AS%20sr_count%2C%20community_board%2C%20complaint_type&%24where=&%24group=community_board%2C%20complaint_type&%24order=sr_count%20DESC&%24limit=&%24%24app_token=NwNjHSDEkdJ2mvFMm1zSNrNAf")

	promise.then(data => {
		expect(data).toEqual(Papa.parse(csv, {header: true}).data)			
		done()
		})

 })

 test('execute promise failed', done => {	
	expect.assertions(3)

	fetch.mockReject(new Error('execute failed'))

	const query = new Query(options)

	const promise = query.execute(null)
    
  //query should still be called and url should still be created
	expect(fetch).toHaveBeenCalledTimes(1)
	expect(fetch.mock.calls[0][0]).toEqual("https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?%24select=count(unique_key)%20AS%20sr_count%2C%20community_board%2C%20complaint_type&%24where=&%24group=community_board%2C%20complaint_type&%24order=sr_count%20DESC&%24limit=&%24%24app_token=NwNjHSDEkdJ2mvFMm1zSNrNAf")

  //promise should be rejected
	promise.catch(data => {
		expect(data).toEqual(new Error('execute failed'))			
		done()
	})

 })


 test('execute json', done => {
	expect.assertions(3)

	fetch.mockResponseOnce(json)

	const query = new Query(options)

	query.setUrl('http://host/data.json')

	const promise = query.execute(null)
	
	expect(fetch).toHaveBeenCalledTimes(1)
	expect(fetch.mock.calls[0][0]).toEqual("http://host/data.json?%24select=count(unique_key)%20AS%20sr_count%2C%20community_board%2C%20complaint_type&%24where=&%24group=community_board%2C%20complaint_type&%24order=sr_count%20DESC&%24limit=&%24%24app_token=NwNjHSDEkdJ2mvFMm1zSNrNAf")

	promise.then(data => {
		expect(data).toEqual(JSON.parse(json).rows)			
		done()
	})

 })
 
test('csv', () => {
  options.url = "file.csv?query"
  const query = new Query(options)
  expect(query.csv()).toBe(true)

  query.setUrl("file.txt")
  expect(query.csv()).toBe(false)

})

test('Query and', () => {
	expect.assertions(3)
	let where = 'where-clause'
	let clause = 'new-clause'
	
	expect(Query.and(where, clause)).toBe('where-clause AND new-clause')

	clause = null
	expect(Query.and(where, clause)).toBe('where-clause')

	where = null
	clause = 'new-clause'
	expect(Query.and(where, clause)).toBe('new-clause')

})
