
import { supabase } from "@/integrations/supabase/client";
import { Review, ReviewStatus } from "@/types/review";

export const getReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        product:product_id (
          name
        ),
        user:user_id (
          id,
          email
        ),
        review_replies (
          *
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(error.message);
    }

    return data.map(review => {
      // Extract customer name from email if available
      let customerName = 'Anonymous';
      if (review.user && review.user.email) {
        const email = review.user.email;
        customerName = email.split('@')[0];
      }

      // Format reply if available
      let reply = null;
      if (review.review_replies && review.review_replies.length > 0) {
        const latestReply = review.review_replies[0];
        reply = {
          message: latestReply.message,
          createdAt: latestReply.created_at
        };
      }

      return {
        id: review.id,
        productId: review.product_id,
        productName: review.product ? review.product.name : 'Unknown Product',
        customerId: review.user_id,
        customerName: customerName,
        rating: review.rating,
        title: review.title || '',
        comment: review.comment || '',
        status: review.status as ReviewStatus,
        helpful: review.helpful_count || 0,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        reportCount: review.report_count || 0,
        reply: reply
      };
    });
  } catch (error) {
    console.error("Error getting reviews:", error);
    throw error;
  }
};

export const saveReviewReply = async (reviewId: string, message: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('review_replies')
      .insert({
        review_id: reviewId,
        message: message,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error saving review reply:", error);
    throw error;
  }
};

export const updateReviewStatus = async (reviewId: string, status: ReviewStatus): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error updating review status:", error);
    throw error;
  }
};

export const getReviewStats = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating, status');
    
    if (error) {
      throw new Error(error.message);
    }

    // Calculate stats
    const total = data.length;
    let totalRating = 0;
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const statusCounts = {
      published: 0,
      pending: 0,
      rejected: 0
    };

    data.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        totalRating += review.rating;
        ratingCounts[review.rating as 1|2|3|4|5]++;
      }

      if (review.status) {
        statusCounts[review.status as ReviewStatus]++;
      }
    });

    const averageRating = total > 0 ? totalRating / total : 0;

    return {
      totalReviews: total,
      averageRating,
      ratingCounts,
      statusCounts
    };
  } catch (error) {
    console.error("Error getting review stats:", error);
    throw error;
  }
};
