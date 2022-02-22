const propsCanvasD = {
  width: {
    type: Number,
    default: 400,
  },
  height: {
    type: Number,
    default: 400,
  },
  border: {
    type: String,
    default: '',
  },
  tool: {
    type: String,
    default: 'pencil',
  },
  bgColor: {
    type: String,
    default: '',
  },
  penSize: {
    type: Number,
    default: 6,
  },
  strokeColor: {
    type: String,
    default: '#000000',
  },
  eraserSize: {
    type: Number,
    default: 6,
  },
  fontSize: {
    type: Number,
    default: 16,
  },
  fontFamily: {
    type: String,
    default: 'sans-serif',
  },
  fontWeight: {
    type: String,
    default: '400',
  },
  shapeStatu: {
    type: String,
    default: 'stroke',
  },
  bucketColor: {
    type: String,
    default: 'black',
  },
  bucketIntensity: {
    type: String,
    default: 20,
  },
};

export default propsCanvasD;
