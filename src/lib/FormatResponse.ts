import { HttpCodes } from "../util/HttpCodes";

class FormatResponse {
  success: boolean;
  status_code: HttpCodes;
  message: string;
  data: null | object;
  /**
   * @param {Boolean} success true/false
   * @param {number} status_code response code
   * @param {string} message addition message
   * @param {object} data response data
   */
  constructor(
    success: boolean,
    status_code: HttpCodes,
    message: string | any,
    data: object | null
  ) {
    this.success = success;
    this.status_code = status_code;
    this.message = message;
    this.data = data;
  }
 
}

export default FormatResponse;
