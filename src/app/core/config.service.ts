import { Injectable } from '@angular/core';
import { AppConfig } from './config.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  get(): AppConfig {
    const json = this.loadTextFileAjaxSync(
      'assets/config.json',
      'application/json'
    );
    if (!json) {
      throw 'Config não encontrado';
    }

    return JSON.parse(json);
  }

  private loadTextFileAjaxSync(filePath: string, mimeType: string) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', filePath, false);
    if (mimeType != null && xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
    xmlhttp.send();
    if (xmlhttp.status === 200) {
      return xmlhttp.responseText;
    } else {
      return null;
    }
  }
}
