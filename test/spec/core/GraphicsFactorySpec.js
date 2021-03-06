import {
  bootstrapDiagram,
  inject
} from 'test/TestHelper';

import { merge } from 'min-dash';

import {
  classes as svgClasses
} from 'tiny-svg';

describe('GraphicsFactory', function() {

  var container;

  function createDiagram(self, options) {

    return bootstrapDiagram(function() {
      container = self.tests[0].__testcontainer__;
      return merge({ canvas: { container: container } }, options);
    }, {});
  }

  beforeEach(createDiagram(this));


  it('should not fail on update root shape', inject(
    function(canvas, graphicsFactory, elementRegistry) {

      // given
      var root = canvas.getRootElement();
      var gfx = elementRegistry.getGraphics(root);

      // when
      graphicsFactory.update('shape', root, gfx);

      // then
      // expect not to throw an exception
    }
  ));


  it('should add <djs-frame> class to frames', inject(
    function(canvas, graphicsFactory, elementFactory) {

      // given
      var root = canvas.getRootElement();
      var element = elementFactory.createShape({
        id: 'frameShape',
        isFrame: true,
        parent: root
      });

      // when
      var gfx = graphicsFactory.create('shape', element);

      // then
      expect(svgClasses(gfx).has('djs-frame')).to.equal(true);
    }));

});
