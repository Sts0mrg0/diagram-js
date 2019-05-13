import {
  append as svgAppend,
  attr as svgAttr,
  classes as svgClasses,
  create as svgCreate,
  remove as svgRemove,
  clear as svgClear
} from 'tiny-svg';

import {
  isObject
} from 'min-dash';


/**
 * Draws connection preview.
 *
 * @param {didi.Injector} injector
 * @param {Canvas} canvas
 * @param {GraphicsFactory} graphicsFactory
 * @param {ElementFactory} elementFactory
 */
export default function ConnectionPreview(
    injector,
    canvas,
    graphicsFactory,
    elementFactory
) {
  this._canvas = canvas;
  this._graphicsFactory = graphicsFactory;
  this._elementFactory = elementFactory;

  // optional components
  this._connectionDocking = injector.get('connectionDocking', false);
  this._layouter = injector.get('layouter', false);
}

ConnectionPreview.$inject = [
  'injector',
  'canvas',
  'graphicsFactory',
  'elementFactory'
];

/**
 * Draw connection preview.
 *
 * @param {Object} context
 * @param {Object|boolean} canConnect
 * @param {Object} [hints]
 */
ConnectionPreview.prototype.drawPreview = function(context, canConnect, hints) {

  hints = hints || {};

  var connectionPreviewGfx = context.connectionPreviewGfx,
      getConnection = context.getConnection,
      source = hints.source,
      target = hints.target,
      waypoints = hints.waypoints || [],
      connectionStart = hints.connectionStart,
      connectionEnd = hints.connectionEnd,
      layouter = this._layouter,
      connectionDocking = this._connectionDocking,
      connection;

  var self = this;

  if (!connectionPreviewGfx) {
    connectionPreviewGfx = context.connectionPreviewGfx = this.createConnectionPreviewGfx();
  }

  svgClear(connectionPreviewGfx);

  if (!getConnection) {
    getConnection = context.getConnection = cacheReturnValues(function(canConnect, source, target) {
      return self.getConnection(canConnect, source, target);
    });
  }

  if (canConnect) {
    connection = getConnection(canConnect, source, target);
  }

  if (!connection) {
    return;
  }

  if (layouter) {
    connection.waypoints = waypoints;

    connection.waypoints = layouter.layoutConnection(connection, {
      source: source,
      target: target,
      connectionStart: connectionStart,
      connectionEnd: connectionEnd
    });
  } else {
    connection.waypoints = source ? [
      { x: source.x + source.width / 2, y: source.y + source.height / 2 },
      { x: event.x, y: event.y }
    ] : [
      { x: event.x, y: event.y },
      { x: target.x + target.width / 2, y: target.y + target.height / 2 }
    ];
  }

  if (connectionDocking) {
    connection.waypoints = connectionDocking.getCroppedWaypoints(connection, source, target);
  }

  this._graphicsFactory.drawConnection(connectionPreviewGfx, connection);
};

/**
 * Remove connection preview container if it exists.
 *
 * @param {Object} [context]
 * @param {SVGElement} [context.connectionPreviewGfx] preview container
 */
ConnectionPreview.prototype.cleanUp = function(context) {
  if (context && context.connectionPreviewGfx) {
    svgRemove(context.connectionPreviewGfx);
  }
};

/**
 * Get connection that connects source and target.
 *
 * @param {Object|boolean} canConnect
 * @param {djs.model.shape} source
 * @param {djs.model.shape} target
 *
 * @returns {djs.model.connection}
 */
ConnectionPreview.prototype.getConnection = function(canConnect, source, target) {
  var attrs = ensureConnectionAttrs(canConnect);

  return this._elementFactory.createConnection(attrs);
};


/**
 * Add and return preview graphics.
 *
 * @returns {SVGElement}
 */
ConnectionPreview.prototype.createConnectionPreviewGfx = function() {
  var gfx = svgCreate('g');

  svgAttr(gfx, {
    pointerEvents: 'none'
  });

  svgClasses(gfx).add('djs-dragger');

  svgAppend(this._canvas.getDefaultLayer(), gfx);

  return gfx;
};

// helpers //////////

/**
 * Returns function that returns cached return values referenced by stringified first argument.
 *
 * @param {Function} fn
 *
 * @return {Function}
 */
function cacheReturnValues(fn) {
  var returnValues = {};

  /**
   * Return cached return value referenced by stringified first argument.
   *
   * @returns {*}
   */
  return function(firstArgument) {
    var key = JSON.stringify(firstArgument);

    var returnValue = returnValues[key];

    if (!returnValue) {
      returnValue = returnValues[key] = fn.apply(null, arguments);
    }

    return returnValue;
  };
}

/**
 * Ensure connection attributes is object.
 *
 * @param {Object|boolean} canConnect
 *
 * @returns {Object}
 */
function ensureConnectionAttrs(canConnect) {
  if (isObject(canConnect)) {
    return canConnect;
  } else {
    return {};
  }
}