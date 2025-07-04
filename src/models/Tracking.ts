import mongoose from 'mongoose';

const TrackingSchema = new mongoose.Schema({
  ticketID: { type: String, required: true },
  startdate: { type: String },
  enddate: { type: String },
  vehicleno: { type: String },
  vehiclenoplate: { type: String },
  easyGo: {
    type: Object,
    required: true,
    default: {}
  },
  // Store MIME type of the image (e.g., image/jpeg)
  contentType: { type: String },
  // Binary image buffers captured on start / end of the trip
  captureDatain: { type: Buffer },
  captureDataout: { type: Buffer },
  subType: { type: String }
})

export default mongoose.models.Tracking || mongoose.model('Tracking', TrackingSchema, 'capture');