import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  index(){
    return "check /swagger for API documentation";
  }


}
