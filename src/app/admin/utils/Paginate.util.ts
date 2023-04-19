import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

/**
 * PaginateClass Util
 */
export class PaginateUtil {
  // data vars
  data: any = null;

  renderData: any = [];

  // pagination vars
  page: number = 1;

  limit: number = 10;

  totalPages: number = 0;

  /**
   * Paginate Provided data w.r.t limit & offset
   *
   *
   * @param data any
   * @param limit number
   * @param offset number
   *
   * @returns void
   */
  paginate(data: any, limit: number, offset: number) {
    this.data = data;
    this.limit = limit;
    this.page = offset;
    this.totalPages = Math.ceil(data.length / limit);
    this.renderData = data.slice((offset - 1) * limit, offset * limit);
  }

  showPagination() {
    return this.renderData.length > 0 && this.totalPages > 1;
  }

  /**
   * Render page numbers on DOM
   *
   * @returns number
   */
  render() {
    return new Array(this.totalPages).fill(0).map((n, index) => index + 1);
  }

  /**
   * Process provided offset
   *
   * @param page
   */
  processOffset(page: number) {
    this.paginate(this.data, this.limit, page);
  }

  /**
   * Prev page navigator
   */
  prev() {
    const page = this.page > 1 ? this.page - 1 : this.page;
    this.paginate(this.data, this.limit, page);
  }

  /**
   * Next page navigator
   */
  next() {
    const page = this.totalPages > this.page ? this.page + 1 : this.page;
    this.paginate(this.data, this.limit, page);
  }
}
