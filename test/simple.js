// 测试用例

const { add, mul } = require('../src/math')
// const assert = require('assert') // node 官方断言方式
const { should, expect, assert } = require('chai') // 第三方断言库三种方式

// 断言(原始写法))
// if (add(2, 3) === 5) {
//     console.log('add(2, 3) === 5');
// } else {
//     console.log('add方法错误');
// }

// 使用nodeJS的assert
// assert.equal(add(2, 3), 5)

// 使用chai
// should()
// add(2, 3).should.equal(5)
// expect(add(2, 3)).to.be(5)
assert.equal(add(2, 3), 5)