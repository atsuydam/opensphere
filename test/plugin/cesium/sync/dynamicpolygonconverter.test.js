goog.require('ol.Feature');
goog.require('ol.geom.Polygon');
goog.require('ol.proj');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Image');
goog.require('ol.style.Style');
goog.require('plugin.cesium.VectorContext');
goog.require('plugin.cesium.sync.DynamicPolygonConverter');
goog.require('test.plugin.cesium.scene');
goog.require('test.plugin.cesium.sync.dynamiclinestring');

describe('plugin.cesium.sync.DynamicPolygonConverter', () => {
  const VectorContext = goog.module.get('plugin.cesium.VectorContext');
  const {testLine} = goog.module.get('test.plugin.cesium.sync.dynamiclinestring');
  const {getRealScene, renderScene} = goog.module.get('test.plugin.cesium.scene');
  const DynamicPolygonConverter = goog.module.get('plugin.cesium.sync.DynamicPolygonConverter');
  const polygonConverter = new DynamicPolygonConverter();

  let feature;
  let geometry;
  let style;
  let context;

  beforeEach(() => {
    enableWebGLMock();
    geometry = new ol.geom.Polygon([[[0, 0], [0, 5], [5, 5], [5, 0], [0, 0]]]);
    feature = new ol.Feature(geometry);
    style = new ol.style.Style();
    layer = new os.layer.Vector();
    scene = getRealScene();
    context = new VectorContext(scene, layer, ol.proj.get(os.proj.EPSG4326));
  });

  const originalProjection = os.map.PROJECTION;
  afterEach(() => {
    disableWebGLMock();
    os.map.PROJECTION = originalProjection;
  });

  const bluish = 'rgba(20,50,255,1)';
  const greenish = 'rgba(10,255,10,1)';

  describe('create', () => {
    it('should create a polygon as a polyline', () => {
      const result = polygonConverter.create(feature, geometry, style, context);
      expect(result).toBe(true);
      expect(context.polylines.length).toBe(1);
      testLine(context.polylines.get(0));
    });

    it('should create a polygon with a given stroke style', () => {
      style.setStroke(new ol.style.Stroke({
        color: greenish,
        width: 4
      }));

      const result = polygonConverter.create(feature, geometry, style, context);
      expect(result).toBe(true);
      testLine(context.polylines.get(0), {color: greenish, width: 4});
    });

    it('should create a dashed polygon if the stroke contains a dash', () => {
      const stroke = new ol.style.Stroke({
        color: greenish,
        width: 1
      });
      stroke.setLineDash([12, 4]);
      style.setStroke(stroke);

      const result = polygonConverter.create(feature, geometry, style, context);
      expect(result).toBe(true);
      testLine(context.polylines.get(0), {
        color: greenish,
        dashPattern: parseInt('1111111111110000', 2),
        width: 1
      });
    });

    it('should create a polygon with holes as multiple polylines', () => {
      const holeCoords = [
        [[0, 0], [0, 5], [5, 5], [5, 0], [0, 0]],
        [[1, 1], [1, 4], [4, 4], [4, 1], [1, 1]]
      ];
      geometry = new ol.geom.Polygon(holeCoords);
      feature = new ol.Feature(geometry);

      const result = polygonConverter.create(feature, geometry, style, context);
      expect(result).toBe(true);
      expect(context.polylines.length).toBe(2);
      testLine(context.polylines.get(0));
      testLine(context.polylines.get(1));
    });
  });

  describe('update', () => {
    it('should update changing line widths', () => {
      style.setStroke(new ol.style.Stroke({
        color: bluish,
        width: 3
      }));

      polygonConverter.create(feature, geometry, style, context);

      const polygon = context.polylines.get(0);

      style.setStroke(new ol.style.Stroke({
        color: greenish,
        width: 4
      }));

      const result = polygonConverter.update(feature, geometry, style, context, polygon);
      expect(result).toBe(true);
    });

    it('should update changing dash patterns', () => {
      const stroke = new ol.style.Stroke({
        color: greenish,
        width: 1
      });
      stroke.setLineDash([12, 4]);
      style.setStroke(stroke);

      polygonConverter.create(feature, geometry, style, context);

      const polygon = context.polylines.get(0);
      stroke.setLineDash([8, 8]);

      const result = polygonConverter.update(feature, geometry, style, context, polygon);
      expect(result).toBe(true);
    });

    it('should update lines with new colors', () => {
      style.setStroke(new ol.style.Stroke({
        color: greenish,
        width: 4
      }));

      let result = polygonConverter.create(feature, geometry, style, context);
      expect(result).toBe(true);

      const polygon = context.polylines.get(0);
      polygon._asynchronous = false;
      renderScene(scene);

      testLine(polygon, {
        color: greenish,
        width: 4,
        cleanedGeometryInstances: true
      });

      style.getStroke().setColor(bluish);

      polygon.dirty = true;
      result = polygonConverter.update(feature, geometry, style, context, polygon);
      expect(result).toBe(true);

      testLine(polygon, {
        color: bluish,
        width: 4,
        cleanedGeometryInstances: true
      });

      expect(polygon.dirty).toBe(false);
    });
  });
});

