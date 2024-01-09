import { Injectable, Logger } from '@nestjs/common';

import { CompanyEnum } from '@financial-project/common';

import { RecordEntity } from '../../records/entities/record.entity';

@Injectable()
export class CompanyAssignerService {
  private readonly logger = new Logger(CompanyAssignerService.name);

  assignCompanies(records: RecordEntity[]): RecordEntity[] {
    for (const record of records) {
      this.assignCompany(record);
    }

    return records;
  }

  private assignCompany(record: RecordEntity): void {
    if (this.isGoogle(record)) {
      record.company = CompanyEnum.Google;
    } else if (this.isYoutube(record)) {
      record.company = CompanyEnum.Youtube;
    } else if (this.isNetflix(record)) {
      record.company = CompanyEnum.Netflix;
    } else if (this.isSpotify(record)) {
      record.company = CompanyEnum.Spotify;
    } else if (this.isPlayStation(record)) {
      record.company = CompanyEnum.PlayStation;
    } else if (this.isKonzum(record)) {
      record.company = CompanyEnum.Konzum;
    } else if (this.isPlodine(record)) {
      record.company = CompanyEnum.Plodine;
    } else if (this.isMueller(record)) {
      record.company = CompanyEnum.Mueller;
    } else if (this.isSpar(record)) {
      record.company = CompanyEnum.Spar;
    } else if (this.isIKEA(record)) {
      record.company = CompanyEnum.IKEA;
    } else if (this.isLidl(record)) {
      record.company = CompanyEnum.Lidl;
    } else if (this.isKaufland(record)) {
      record.company = CompanyEnum.Kaufland;
    } else if (this.isMlinar(record)) {
      record.company = CompanyEnum.Mlinar;
    } else if (this.isPekaraDubravica(record)) {
      record.company = CompanyEnum.PekaraDubravica;
    } else if (this.isStudenac(record)) {
      record.company = CompanyEnum.Studenac;
    }
  }

  private checkForKeywords(target: string, keywords: string[]): boolean {
    if (!target) {
      return false;
    }

    target = target.toLowerCase();

    return keywords.some((keyword) => target.includes(keyword));
  }

  private isGoogle({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['google'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isYoutube({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['youtube'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isNetflix({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['netflix'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isSpotify({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['spotify'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isPlayStation({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['playstation'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isKonzum({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['konzum'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isPlodine({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['plodine'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isMueller({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['mueller'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isSpar({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['spar'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isIKEA({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['ikea'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isLidl({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['lidl'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isKaufland({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['kaufland'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isMlinar({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['mlinar'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isPekaraDubravica({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['dubravica'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }

  private isStudenac({ name, description, comment }: RecordEntity): boolean {
    const keywords: string[] = ['studenac'];

    return (
      this.checkForKeywords(name, keywords) ||
      this.checkForKeywords(description, keywords) ||
      this.checkForKeywords(comment, keywords)
    );
  }
}
