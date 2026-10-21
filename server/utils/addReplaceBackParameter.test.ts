import { addReplaceBackParameter } from './addReplaceBackParameter'

describe('utils/addReplaceBackParameter', () => {
  it('should replace backParam if it exists', () => {
    expect(addReplaceBackParameter('url?back=old', 'back=new')).toEqual('url?back=new')
  })
  it('should add backParam if no params', () => {
    expect(addReplaceBackParameter('url', 'back=new')).toEqual('url?back=new')
  })
  it('should add backParam to other params if they exist', () => {
    expect(addReplaceBackParameter('url?param1=one', 'back=new')).toEqual('url?param1=one&back=new')
  })

  describe('when invalid url are passed in', () => {
    it('throws an error when a relative path is used', () => {
      expect(() => addReplaceBackParameter('../url?param1=one', 'back=new')).toThrow(
        new Error('Invalid URL passed through'),
      )
    })

    it.each([...Array.from({ length: 0x20 }, (_, code) => code), 0x7f])(
      'throws an error when the URL contains ASCII control code %i',
      code => {
        const url = `url${String.fromCharCode(code)}`

        expect(() => addReplaceBackParameter(url, 'back=new')).toThrow(new Error('Invalid URL passed through'))
      },
    )

    it.each([0x20, 0x7e, 0x80])('allows character code %i in the URL', code => {
      const url = `url${String.fromCharCode(code)}`

      expect(addReplaceBackParameter(url, 'back=new')).toBe(`${url}?back=new`)
    })
  })
})
