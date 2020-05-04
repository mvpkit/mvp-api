import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  index(){
    return "Home";
  }

  @Get('about')
  about(){
    return "About";
  }

  @Get('contact')
  contact(){
    return "Contact";
  }

}
