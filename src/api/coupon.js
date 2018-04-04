import Pagebase from './page';
export default class leke extends Pagebase {
  static async getTicketInfo () {
    return await this.request( {
      url: '/h5/my/tickets'
    } );
  }
}
