export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          products_count: number | null
          slug: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          products_count?: number | null
          slug: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          products_count?: number | null
          slug?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_categories: {
        Row: {
          category_id: string
          coupon_id: string
          id: string
        }
        Insert: {
          category_id: string
          coupon_id: string
          id?: string
        }
        Update: {
          category_id?: string
          coupon_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_categories_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_codes: {
        Row: {
          applicable_categories: string | null
          applicable_products: string | null
          code: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          max_discount: number | null
          min_purchase: number | null
          per_customer: number | null
          start_date: string
          status: string | null
          type: string
          updated_at: string
          usage_count: number | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          applicable_categories?: string | null
          applicable_products?: string | null
          code: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          max_discount?: number | null
          min_purchase?: number | null
          per_customer?: number | null
          start_date: string
          status?: string | null
          type: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          applicable_categories?: string | null
          applicable_products?: string | null
          code?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          max_discount?: number | null
          min_purchase?: number | null
          per_customer?: number | null
          start_date?: string
          status?: string | null
          type?: string
          updated_at?: string
          usage_count?: number | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      coupon_products: {
        Row: {
          coupon_id: string
          id: string
          product_id: string
        }
        Insert: {
          coupon_id: string
          id?: string
          product_id: string
        }
        Update: {
          coupon_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_products_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          amount_saved: number
          coupon_id: string
          created_at: string
          id: string
          order_id: string
          user_id: string
        }
        Insert: {
          amount_saved: number
          coupon_id: string
          created_at?: string
          id?: string
          order_id: string
          user_id: string
        }
        Update: {
          amount_saved?: number
          coupon_id?: string
          created_at?: string
          id?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          type: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          type: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          type?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          total_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
          total_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
          total_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          carrier: string | null
          created_at: string
          delivery_status: string | null
          estimated_delivery: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          shipping_address: Json
          shipping_cost: number | null
          shipping_method: string | null
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          carrier?: string | null
          created_at?: string
          delivery_status?: string | null
          estimated_delivery?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_number: string | null
          created_at: string
          expiry_date: string | null
          id: string
          is_default: boolean
          payment_type: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          payment_type: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_default?: boolean
          payment_type?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_attribute_values: {
        Row: {
          attribute_id: string
          created_at: string
          id: string
          product_id: string
          value: string
        }
        Insert: {
          attribute_id: string
          created_at?: string
          id?: string
          product_id: string
          value: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          id?: string
          product_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "product_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          created_at: string
          display_name: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          is_primary: boolean | null
          product_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_primary?: boolean | null
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inventory: {
        Row: {
          id: string
          location_id: string
          product_id: string
          quantity: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          id?: string
          location_id: string
          product_id: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          id?: string
          location_id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_tags_mapping: {
        Row: {
          created_at: string
          id: string
          product_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_mapping_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_mapping_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "product_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          additional_price: number | null
          created_at: string
          id: string
          name: string
          product_id: string
          stock: number
          type: string
          updated_at: string
          value: string
        }
        Insert: {
          additional_price?: number | null
          created_at?: string
          id?: string
          name: string
          product_id: string
          stock?: number
          type: string
          updated_at?: string
          value: string
        }
        Update: {
          additional_price?: number | null
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          stock?: number
          type?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          discount_percentage: number | null
          hot_selling: boolean | null
          id: string
          image_url: string | null
          is_new: boolean | null
          is_sale: boolean | null
          name: string
          original_price: number | null
          price: number
          sku: string | null
          status: string
          stock: number
          trending: boolean | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          hot_selling?: boolean | null
          id?: string
          image_url?: string | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name: string
          original_price?: number | null
          price: number
          sku?: string | null
          status?: string
          stock?: number
          trending?: boolean | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          hot_selling?: boolean | null
          id?: string
          image_url?: string | null
          is_new?: boolean | null
          is_sale?: boolean | null
          name?: string
          original_price?: number | null
          price?: number
          sku?: string | null
          status?: string
          stock?: number
          trending?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          cost_price: number
          created_at: string
          id: string
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity: number | null
          total_cost: number
          variant_id: string | null
        }
        Insert: {
          cost_price: number
          created_at?: string
          id?: string
          product_id: string
          purchase_order_id: string
          quantity: number
          received_quantity?: number | null
          total_cost: number
          variant_id?: string | null
        }
        Update: {
          cost_price?: number
          created_at?: string
          id?: string
          product_id?: string
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number | null
          total_cost?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          created_by: string
          expected_delivery_date: string | null
          id: string
          notes: string | null
          payment_status: string | null
          status: string | null
          total_amount: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_status?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      review_replies: {
        Row: {
          created_at: string
          id: string
          message: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_replies_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          product_id: string
          rating: number
          report_count: number | null
          status: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id: string
          rating: number
          report_count?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          product_id?: string
          rating?: number
          report_count?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: string
          city: string
          country: string
          created_at: string
          id: string
          is_default: boolean
          postal_code: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type?: string
          city: string
          country: string
          created_at?: string
          id?: string
          is_default?: boolean
          postal_code: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: string
          city?: string
          country?: string
          created_at?: string
          id?: string
          is_default?: boolean
          postal_code?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: Json | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: Json | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: Json | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      warehouse_locations: {
        Row: {
          address: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          address?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          address?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args:
          | { user_id: number; role_name: string }
          | { user_id: string; role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "customer"],
    },
  },
} as const
