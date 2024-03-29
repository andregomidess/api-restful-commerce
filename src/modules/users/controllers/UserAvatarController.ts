import { Response, Request } from 'express';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import { instanceToInstance } from 'class-transformer';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateAvatar = new UpdateUserAvatarService();
    const user = updateAvatar.execute({
      userId: request.user.id,
      avatarFileName: request.file?.filename as string,
    });

    return response.json(instanceToInstance(user));
  }
}
