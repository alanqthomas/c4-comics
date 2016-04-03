package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Constants;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Series;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;

import javax.inject.Named;
import javax.jdo.PersistenceManager;

//import com.google.api.server.spi.response.*;

@Api(name = "gcsendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class GcsEndpoint {

	/**
	 * This method takes the filename of an object stored in Google Cloud Storage and generates a
	 * blobkey and serving url for the image and sets it to the specified user's bg image
	 * @param filename name and extension, ie. picture.png, of object in GCS
	 * @param userId userId to set image information
	 * @return C4User where images were stored
	 * @throws BadRequestException
	 * @throws NotFoundException
	 */
	@ApiMethod(name = "updateuserbgimage", path="c4user/{userid}/updatebg/{filename}")
	public C4User updateUserBgImage(@Named("filename") String filename, 
			@Named("userid") String userId) throws BadRequestException, NotFoundException {
		
		BlobKey blobKey = generateBlobKey(filename);
		String servingurl = generateServingURL(blobKey);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			C4User c4user = mgr.getObjectById(C4User.class, userId);
			c4user.setBgImage(blobKey);			
			c4user.setBgImageURL(servingurl);
			mgr.makePersistent(c4user);
			return c4user;
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User with ID " + userId + " does not exist.");
		} finally {				
			mgr.close();
		}
	}
	
	/**
	 * This method takes the filename of an object stored in Google Cloud Storage and generates a
	 * blobkey and serving url for the image and sets it to the specified user's profile image
	 * @param filename name and extension, ie. picture.png, of object in GCS
	 * @param userId userId to set image information
	 * @return C4User where images were stored
	 * @throws BadRequestException
	 * @throws NotFoundException
	 */
	@ApiMethod(name = "updateuserprofileimage", path="c4user/{userid}/updateprofile/{filename}")
	public C4User updateUserProfileImage(@Named("filename") String filename, 
			@Named("userid") String userId) throws BadRequestException, NotFoundException {
		
		BlobKey blobKey = generateBlobKey(filename);
		String servingurl = generateServingURL(blobKey);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			C4User c4user = mgr.getObjectById(C4User.class, userId);
			c4user.setProfileImage(blobKey);			
			c4user.setProfileImageURL(servingurl);
			mgr.makePersistent(c4user);
			return c4user;
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User with ID " + userId + " does not exist.");
		} finally {				
			mgr.close();
		}
	}
	
	/**
	 * This method takes the filename of an object stored in Google Cloud Storage and generates a
	 * blobkey and serving url for the image and sets it to the specified series's bg image
	 * @param filename name and extension, ie. picture.png, of object in GCS
	 * @param seriesId seriesId to set image information
	 * @return Series where images were stored
	 * @throws BadRequestException
	 * @throws NotFoundException
	 */
	@ApiMethod(name = "updateseriesbgimage")
	public Series updateSeriesBgImage(@Named("filename") String filename,
			@Named("seriesid") Long seriesId) throws BadRequestException, NotFoundException {
		
		BlobKey blobKey = generateBlobKey(filename);
		String servingurl = generateServingURL(blobKey);
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			Series series = mgr.getObjectById(Series.class, seriesId);
			series.setBgImage(blobKey);			
			series.setBgImageURL(servingurl);
			mgr.makePersistent(series);
			return series;
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("Series with ID " + seriesId + " does not exist.");
		} finally {				
			mgr.close();
		}
	}
	
	private BlobKey generateBlobKey(String filename){
		BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
		BlobKey blobKey = blobstoreService.createGsBlobKey("/gs/" + Constants.GCS_BUCKET + "/" + filename);
		return blobKey;
	}
	
	private String generateServingURL(BlobKey blobKey){
		String url = null;
		ImagesService is = ImagesServiceFactory.getImagesService();
		ServingUrlOptions opts = ServingUrlOptions.Builder.withBlobKey(blobKey);
		url = is.getServingUrl(opts);
		return url;
	}
	
	private void deleteServingURL(BlobKey blobKey){
		ImagesService is = ImagesServiceFactory.getImagesService();
		is.deleteServingUrl(blobKey);
	}
	
	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}
