var LOW_PRIORITY = 740;


/**
 * Shows connection preview during create.
 *
 * @param {EventBus} eventBus
 * @param {ConnectionPreview} connectionPreview
 */
export default function CreateConnectPreview(eventBus, connectionPreview) {
  eventBus.on('create.move', LOW_PRIORITY, function(event) {
    var context = event.context,
        source = context.source,
        shape = context.shape,
        canExecute = context.canExecute,
        canConnect = canExecute && canExecute.connect;

    // place shape's center on cursor
    shape.x = Math.round(event.x - shape.width / 2);
    shape.y = Math.round(event.y - shape.height / 2);

    connectionPreview.drawPreview(context, canConnect, {
      source: source,
      target: shape,
      waypoints: []
    });
  });


  eventBus.on('create.cleanup', function(event) {
    connectionPreview.cleanUp(event.context);
  });

}

CreateConnectPreview.$inject = [
  'eventBus',
  'connectionPreview'
];
