import { Injectable } from '@nestjs/common';
import { Model, SortOrder } from 'mongoose';

interface IListParams {
  searchTerm?: string;
  searchFields?: string[];
  filter?: any;
  page: number;
  limit: number;
  populateParent?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

@Injectable()
export class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  // List entities with optional search/filter/pagination
  async list(params: IListParams): Promise<{
    nextPage: number;
    data: T[];
    page: number;
    limit: number;
    totalCount: number;
    message: string;
  }> {
    const {
      searchTerm,
      searchFields,
      sortBy,
      sortOrder,
      page,
      limit,
      filter,
      populateParent,
    } = params;

    // Build filter query
    let query = this.model.find();

    if (filter) {
      // apply additional filters
      query = query.where(filter);
    }

    // apply search filter
    if (searchTerm) {
      const searchArray = [];
      searchFields.forEach((field) => {
        searchArray.push({ [field]: { $regex: new RegExp(searchTerm, 'i') } });
      });
      query = query.where({
        $or: searchArray,
      });
    }

    // Sort
    const sort = { [sortBy]: sortOrder };
    query = query.sort(sort);

    // Execute query and retrieve entities
    let entities;

    if (populateParent) {
      entities = await query.populate(populateParent).exec();
    } else {
      entities = await query.exec();
    }

    // Get total records count
    let totalCount = entities.length;

    // Apply pagination
    if (page && limit) {
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      entities = entities.slice(startIndex, endIndex);
    }

    const nextPage =
      page && limit && entities.length === limit ? page + 1 : null;

    const message = nextPage
      ? 'Data fetched successfully'
      : `No data found on page ${page}`;

    // Return result along with total records count
    return { nextPage, data: entities, page, limit, totalCount, message };
  }
}
