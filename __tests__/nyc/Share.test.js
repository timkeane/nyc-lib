import Container from 'nyc/Container'
import ReplaceTokens from 'nyc/ReplaceTokens'
import Share from 'nyc/Share'

const manifest = '{"name": "App Name", "description": "App Description"}'

let target
beforeEach(() => {
  $.resetMocks()
  fetch.resetMocks()
  fetch.mockResponseOnce(manifest)
  target = $('<div></div>')
  $('body').append(target)
})
afterEach(() => {
  target.remove()
})

test('constructor', () => {
  expect.assertions(7)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        expect(fetch.mock.calls.length).toEqual(1)
        expect(fetch.mock.calls[0][0]).toEqual('./manifest.webmanifest')
        resolve(share.getContainer().html())
      }, 500)
    })
  }

  expect(share instanceof Container).toBe(true)
  expect(share instanceof Share).toBe(true)
  expect(share.getContainer().length).toBe(1)

  return test().then(html => {
    expect(html.length > 1).toBe(true)
    expect(html).toBe(
      '<div class="shr" role="region" title="Share this page via social media or email"><a class="btn-shr btn-sq rad-all" role="button" href="#" title="Share..." aria-pressed="false" aria-controls="share-0"><span class="screen-reader-only">Share...</span></a><div class="btns" aria-expanded="false" aria-collapsed="true" id="share-0"><a class="btn-sq rad-all facebook" role="button" href="https://www.facebook.com/sharer/sharer.php?u=http://localhost/" target="_blank" rel="noopener noreferrer" title="Facebook"><span class="screen-reader-only">Facebook</span></a><a class="btn-sq rad-all twitter" role="button" href="https://twitter.com/intent/tweet?text=http://localhost/ @nycgov&amp;source=webclient" target="_blank" rel="noopener noreferrer" title="Twitter"><span class="screen-reader-only">Twitter</span></a><a class="btn-sq rad-all linkedin" role="button\" href="http://www.linkedin.com/shareArticle?mini=true&amp;url=http://localhost/" target="_blank" rel="noopener noreferrer" title="LinkedIn"><span class="screen-reader-only">LinkedIn</span></a><a class="btn-sq rad-all tumblr" role="button" href="http://www.tumblr.com/share/link?url=http://localhost/&amp;name=App Name&amp;description=via%20NYC.gov" target="_blank" rel="noopener noreferrer" title="Tumblr"><span class="screen-reader-only">Tumblr</span></a><a class="btn-sq rad-all email" role="button" href="mailto:?subject=App Name&amp;body=App Description%0A%0Ahttp://localhost/" title="email"><span class="screen-reader-only">Email</span></a></div></div>'
    )
  })
})

test('show/hide', () => {
  expect.assertions(13)

  const share = new Share({target: target})

  const test = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        share.btn.trigger('click')
        expect(share.btn.attr('aria-pressed')).toBe('true')
        expect(share.btns.attr('aria-expanded')).toBe('true')
        expect(share.btns.attr('aria-collapsed')).toBe('false')
        expect(share.btns.css('display')).toBe('block')

        $('body').trigger('click')
        expect(share.btn.attr('aria-pressed')).toBe('false')
        expect(share.btns.attr('aria-expanded')).toBe('false')
        expect(share.btns.attr('aria-collapsed')).toBe('true')
        expect(share.btns.css('display')).toBe('none')

        share.btn.trigger('click')
        expect(share.btn.attr('aria-pressed')).toBe('true')
        expect(share.btns.attr('aria-expanded')).toBe('true')
        expect(share.btns.attr('aria-collapsed')).toBe('false')
        expect(share.btns.css('display')).toBe('block')

        resolve(true)
      }, 500)
    })
  }

  return test().then(success => {expect(success).toBe(true)})
})