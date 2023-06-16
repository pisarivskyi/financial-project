import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../../../../../../environments/environment';
import { Database } from '../types/database.types';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
