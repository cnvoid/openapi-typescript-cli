import request from "./request"
import { AxiosRequestConfig } from 'axios'
import * as Type from './index.d'

export let pet = {

    // Update an existing pet by Id.
    updatePet: async (param: Type.Pet, opt: AxiosRequestConfig = {}): Promise<Type.Pet> => await request({
      url: '/pet',
      method: 'put',
      data: param,
      ...opt,
    }),

    // Add a new pet to the store.
    addPet: async (param: Type.Pet, opt: AxiosRequestConfig = {}): Promise<Type.Pet> => await request({
      url: '/pet',
      method: 'post',
      data: param,
      ...opt,
    }),

    // Multiple status values can be provided with comma separated strings.
    findPetsByStatus: async (param: Type.QueryTypefindPetsByStatus, opt: AxiosRequestConfig = {}): Promise<Type.Pet[]> => await request({
      url: '/pet/findByStatus',
      method: 'get',
      params: {status: param?.status,},
      ...opt,
    }),

    // Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
    findPetsByTags: async (param: Type.QueryTypefindPetsByTags, opt: AxiosRequestConfig = {}): Promise<Type.Pet[]> => await request({
      url: '/pet/findByTags',
      method: 'get',
      params: {tags: param?.tags,},
      ...opt,
    }),

    // Returns a single pet.
    getPetById: async (param: Type.QueryTypegetPetById, opt: AxiosRequestConfig = {}): Promise<Type.Pet> => await request({
      url: '/pet/${parms[petId]}',
      method: 'get',
      params: {petId: param?.petId,},
      ...opt,
    }),

    // Updates a pet resource based on the form data.
    updatePetWithForm: async (param: Type.QueryTypeupdatePetWithForm, opt: AxiosRequestConfig = {}): Promise<Type.Pet> => await request({
      url: '/pet/${parms[petId]}',
      method: 'post',
      params: {petId: param?.petId,name: param?.name,status: param?.status,},
      ...opt,
    }),

    // Delete a pet.
    deletePet: async (param: Type.QueryTypedeletePet, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/pet/${parms[petId]}',
      method: 'delete',
      params: {api_key: param?.api_key,petId: param?.petId,},
      ...opt,
    }),

    // Upload image of the pet.
    uploadFile: async (param: Type.QueryTypeuploadFile | string | any, opt: AxiosRequestConfig = {}): Promise<Type.ApiResponse> => await request({
      url: '/pet/${parms[petId]}/uploadImage',
      method: 'post',
      params: {petId: param?.petId,additionalMetadata: param?.additionalMetadata,},
      data: param,
      ...opt,
    }),
}

export let store = {

    // Returns a map of status codes to quantities.
    getInventory: async (param: any, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/store/inventory',
      method: 'get',
      ...opt,
    }),

    // Place a new order in the store.
    placeOrder: async (param: Type.Order, opt: AxiosRequestConfig = {}): Promise<Type.Order> => await request({
      url: '/store/order',
      method: 'post',
      data: param,
      ...opt,
    }),

    // For valid response try integer IDs with value <= 5 or > 10. Other values will generate exceptions.
    getOrderById: async (param: Type.QueryTypegetOrderById, opt: AxiosRequestConfig = {}): Promise<Type.Order> => await request({
      url: '/store/order/${parms[orderId]}',
      method: 'get',
      params: {orderId: param?.orderId,},
      ...opt,
    }),

    // For valid response try integer IDs with value < 1000. Anything above 1000 or nonintegers will generate API errors.
    deleteOrder: async (param: Type.QueryTypedeleteOrder, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/store/order/${parms[orderId]}',
      method: 'delete',
      params: {orderId: param?.orderId,},
      ...opt,
    }),
}

export let user = {

    // This can only be done by the logged in user.
    createUser: async (param: Type.User, opt: AxiosRequestConfig = {}): Promise<Type.User> => await request({
      url: '/user',
      method: 'post',
      data: param,
      ...opt,
    }),

    // Creates list of users with given input array.
    createUsersWithListInput: async (param: Type.User[], opt: AxiosRequestConfig = {}): Promise<Type.User> => await request({
      url: '/user/createWithList',
      method: 'post',
      data: param,
      ...opt,
    }),

    // Log into the system.
    loginUser: async (param: Type.QueryTypeloginUser, opt: AxiosRequestConfig = {}): Promise<string> => await request({
      url: '/user/login',
      method: 'get',
      params: {username: param?.username,password: param?.password,},
      ...opt,
    }),

    // Log user out of the system.
    logoutUser: async (param: Type.QueryTypelogoutUser, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/user/logout',
      method: 'get',
      params: {},
      ...opt,
    }),

    // Get user detail based on username.
    getUserByName: async (param: Type.QueryTypegetUserByName, opt: AxiosRequestConfig = {}): Promise<Type.User> => await request({
      url: '/user/${parms[username]}',
      method: 'get',
      params: {username: param?.username,},
      ...opt,
    }),

    // This can only be done by the logged in user.
    updateUser: async (param: Type.QueryTypeupdateUser | Type.User | any, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/user/${parms[username]}',
      method: 'put',
      params: {username: param?.username,},
      data: param,
      ...opt,
    }),

    // This can only be done by the logged in user.
    deleteUser: async (param: Type.QueryTypedeleteUser, opt: AxiosRequestConfig = {}): Promise<any> => await request({
      url: '/user/${parms[username]}',
      method: 'delete',
      params: {username: param?.username,},
      ...opt,
    }),
}

