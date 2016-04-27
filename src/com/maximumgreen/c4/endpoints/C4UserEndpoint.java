package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.Comment;
import com.maximumgreen.c4.Notification;
import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Series;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Field;
import com.maximumgreen.c4.endpoints.IndexService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;
import java.lang.Long;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

//import com.google.api.server.spi.response.*;

@Api(name = "c4userendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class C4UserEndpoint {

	private final static Logger log = Logger.getLogger(C4UserEndpoint.class.getName());
	
	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listC4User")
	public CollectionResponse<C4User> listC4User(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<C4User> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(C4User.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<C4User>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (C4User obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<C4User> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getC4User")
	public C4User getC4User(@Named("id") String id) throws BadRequestException, NotFoundException {
		if (id == null)
			throw new BadRequestException("User ID must be specified");
		
		PersistenceManager mgr = getPersistenceManager();
		C4User c4user = null;
		try {
			c4user = mgr.getObjectById(C4User.class, id);
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User ID not yet registered with C4");
		} finally {
			mgr.close();
		}
		return c4user;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 * 
	 * This is for login. 
	 *
	 * @param c4user the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertC4User")
	public C4User insertC4User(C4User c4user) throws BadRequestException {
		if (c4user.getUserID() == null || c4user.getUsername() == null || c4user.getEmail() == null)
			throw new BadRequestException("One or more required fields are missing");
		
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (containsC4User(c4user)) {
				throw new BadRequestException("User already exists");
			}
			mgr.makePersistent(c4user);
			index(c4user);
		} finally {
			mgr.close();
		}
		return c4user;
	}

	/**
	 * This method is used for updating an existing entity. If the entity does not
	 * exist in the datastore, an exception is thrown.
	 * It uses HTTP PUT method.
	 *
	 * @param c4user the entity to be updated.
	 * @return The updated entity.
	 */
	@ApiMethod(name = "updateC4User")
	public C4User updateC4User(C4User c4user) throws BadRequestException, NotFoundException {
		if (c4user.getUserID() == null)
			throw new BadRequestException("User ID can not be null");
		PersistenceManager mgr = getPersistenceManager();
		C4User updatedUser;
		try {
			//get the user from the datastore
			updatedUser = getC4User(c4user.getUserID());
			//check every c4user field and see if it's trying to be updated
			//if username is updated, update the user's comments
			if (c4user.getUsername() != null){
				updatedUser.setUsername(c4user.getUsername());
				updateComments(updatedUser);
			}
			if (c4user.getBiography() != null)
				updatedUser.setBiography(c4user.getBiography());
			if (c4user.isAdministrator() != updatedUser.isAdministrator())
				updatedUser.setAdministrator(c4user.isAdministrator());
			if (c4user.getProfileImageURL() != null)
				updatedUser.setProfileImageURL(c4user.getProfileImageURL());
			if (c4user.getRating() != 0 && (c4user.getRating() != updatedUser.getRating()))
				updatedUser.setRating(c4user.getRating());
			if (c4user.getCssBgColor() != null)
				updatedUser.setCssBgColor(c4user.getCssBgColor());
			if (c4user.getCssFontColor() != null)
				updatedUser.setCssFontColor(c4user.getCssFontColor());
			
			//save the updates
			mgr.makePersistent(updatedUser);
			index(updatedUser);
		} catch (NotFoundException ex) {
			throw ex;
		} finally {
			mgr.close();
		}
		//return the updated object
		return updatedUser;
	}
	
	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeC4User")
	public void removeC4User(@Named("id") String id) {
		PersistenceManager mgr = getPersistenceManager();
		try {
			C4User c4user = mgr.getObjectById(C4User.class, id);			
			mgr.deletePersistent(c4user);
			IndexService.removeDocument(IndexService.USER, c4user.getUserID());
		} finally {
			mgr.close();
		}
	}

	//CUSTOM METHODS
	@ApiMethod(name="adduserseries")
	public C4User addUserSeries(@Named("userId") String userId, @Named("seriesId") Long seriesId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (user.getUserSeries() == null){
				List<Long> list = new ArrayList<Long>();
				user.setUserSeries(list);
			}
			
			user.addUserSeries(seriesId);
			notifyFollowers(user, series);
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	@ApiMethod(name="deleteuserseries")
	public C4User deleteUserSeries(@Named("userId") String userId, @Named("seriesId") Long seriesId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			user.deleteUserSeries(seriesId);
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User Id invalid.");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	/**
	 * This method adds the specified series id to the specified user's subscription list
	 * @param userId the user's unique user id
	 * @param seriesId the id of the series to add to the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="addsubscription")
	public C4User addSubscription(@Named("userId") String userId, @Named("seriesId") Long seriesId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (user.getSubscriptions() == null){
				List<Long> list = new ArrayList<Long>();
				user.setSubscriptions(list);
			}
			if (series.getSubscribers() == null){
				List<String> list = new ArrayList<String>();
				series.setSubscribers(list);
			}
			
			user.addSubscription(seriesId);
			series.addSubscriber(userId);
			
			mgr.makePersistent(user);
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new NotFoundException("User or Series Id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	/**
	 * This method deletes the specified series id to the specified user's subscription list
	 * @param googleId the user's googleId
	 * @param seriesId the id of the series to delete from the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="deletesubscription")
	public C4User deleteSubscription(@Named("userId") String userId, @Named("seriesId") Long seriesId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		Series series;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			series = mgr.getObjectById(Series.class, seriesId);
			
			if (user.getSubscriptions() != null)
				user.deleteSubscription(seriesId);
			if (series.getSubscribers() != null)
				series.deleteSubscriber(userId);
			
			mgr.makePersistent(user);
			mgr.makePersistent(series);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User or Series Id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	/**
	 * This method adds the specified author key to the specified user's follow list
	 * @param userId the user's unique user id
	 * @param seriesId the id of the author to add to the user's follow list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="addfollow")
	public C4User addFollow(@Named("userId") String userId, @Named("authorId") String authorId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		if (userId.compareTo(authorId) == 0)
			throw new BadRequestException("User cannot follow themself.");
		
		C4User user;
		C4User author;
		
		try {
			user = getC4User(userId);
			author = getC4User(authorId);
			
			if (user.getFollowing() == null){
				List<String> list = new ArrayList<String>();
				user.setFollowing(list);
			}
			if (author.getFollowers() == null){
				List<String> list = new ArrayList<String>();
				author.setFollowers(list);
			}
			
			user.addFollow(authorId);
			author.addFollower(userId);
			
			mgr.makePersistent(user);
			mgr.makePersistent(author);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User or Author Id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	/**
	 * This method deletes the specified author id to the specified user's follow list
	 * @param googleId the user's googleId
	 * @param authorId the id of the series to delete from the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="deletefollow")
	public C4User deleteFollow(@Named("userId") String userId, @Named("authorId") String authorId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		C4User author;
		
		try {
			user = getC4User(userId);
			author = getC4User(authorId);
			
			if (user.getFollowing() != null){
				user.deleteFollow(authorId);
			}
			if (author.getFollowers() != null){
				author.deleteFollower(userId);
			}
			
			mgr.makePersistent(user);
			mgr.makePersistent(author);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User or Author Id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	@ApiMethod(name="deleteNotification")
	public C4User deleteNotification(@Named("userId") String userId, @Named("notificationId") Long notificationId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		C4User user;
		
		try {
			user = getC4User(userId);
			
			if (user.getNotifications() != null){
				user.deleteNotification(notificationId);
			}
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User Id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	/**
	 * This method add a favorite to a users favorites depending on the paramaters
	 * @param userId id of user to add favorites to
	 * @param authorId id of author to add to favorite
	 * @param otherId id of series or comic to add to favorite
	 * @throws BadRequestException
	 * @throws NotFoundException
	 */
	@ApiMethod(name="addfavorite")
	public C4User addFavorite(@Named("userId") String userId, 
			@Nullable @Named("authorId") String authorId, @Nullable @Named("seriesId") Long seriesId,
			@Nullable @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		if (authorId == null && seriesId == null && comicId == null)
			throw new BadRequestException("All three Ids cannot be null");
		if ((authorId != null && (seriesId != null || comicId != null))
				|| (seriesId != null && (authorId != null || comicId != null))
				|| (comicId != null && (authorId != null || seriesId != null)))
			throw new BadRequestException("Two Ids must be null");
		
		C4User user;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			
			if (authorId != null){
				if (user.getFavoriteAuthors() == null){
					List<String> list = new ArrayList<String>();
					user.setFavoriteAuthors(list);
				}
				user.addFavoriteAuthor(authorId);
			}
			
			if (seriesId != null){
				if (user.getFavoriteSeries() == null){
					List<Long> list = new ArrayList<Long>();
					user.setFavoriteSeries(list);
				}
				user.addFavoriteSeries(seriesId);
			}
			
			if (comicId != null){
				if (user.getFavoriteComics() == null){
					List<Long> list = new ArrayList<Long>();
					user.setFavoriteComics(list);
				}
				user.addFavoriteComic(comicId);
			}
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	/**
	 * This method deletes a favorite from a users favorites depending on the paramaters
	 * @param userId id of user to add favorites to
	 * @param authorId id of author to add to favorite
	 * @param otherId id of series or comic to add to favorite
	 * @throws BadRequestException
	 * @throws NotFoundException
	 */
	@ApiMethod(name="deletefavorite")
	public C4User deleteFavorite(@Named("userId") String userId, 
			@Nullable @Named("authorId") String authorId, @Nullable @Named("seriesId") Long seriesId,
			@Nullable @Named("comicId") Long comicId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		if (authorId == null && seriesId == null && comicId == null)
			throw new BadRequestException("All three Ids cannot be null");
		if ((authorId != null && (seriesId != null || comicId != null))
				|| (seriesId != null && (authorId != null || comicId != null))
				|| (comicId != null && (authorId != null || seriesId != null)))
			throw new BadRequestException("Two Ids must be null");
		
		
		C4User user;
		
		try {
			user = mgr.getObjectById(C4User.class, userId);
			
			if (authorId != null){
				if (user.getFavoriteAuthors() != null){
					user.deleteFavoriteAuthor(authorId);
				}
			}
			
			if (seriesId != null){
				if (user.getFavoriteSeries() == null){
					user.deleteFavoriteSeries(seriesId);
				}
			}
			
			if (comicId != null){
				if (user.getFavoriteComics() == null){
					user.deleteFavoriteComic(comicId);
				}
			}
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User id invalid");
		} finally {
			mgr.close();
		}
		
		return user;
	}
	
	private boolean containsC4User(C4User c4user) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(C4User.class, c4user.getUserID());
		} catch (javax.jdo.JDOObjectNotFoundException ex) {
			contains = false;
		} finally {
			mgr.close();
		}
		return contains;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}
	
	private void index(C4User c4user){				
		Document doc = Document.newBuilder()
				.setId(c4user.getUserID())
				.addField(Field.newBuilder().setName("id").setText(c4user.getUserID()))
				.addField(Field.newBuilder().setName("username").setText(c4user.getUsername()))
				.addField(Field.newBuilder().setName("email").setText(c4user.getEmail()))
				.build();
		IndexService.indexDocument(IndexService.USER, doc);
	}
	
	private void updateComments(C4User user){
		if (user.getComments() != null) {
			PersistenceManager mgr = getPersistenceManager();
			for (Long c : user.getComments()){
				Comment comment =  mgr.getObjectById(Comment.class, c);
				comment.setUsername(user.getUsername());
				mgr.makePersistent(comment);
			}
			mgr.close();
		}
	}
	
	private void notifyFollowers(C4User user, Series series){
		//check if the user has followers first
		if (user.getFollowers() != null){
			PersistenceManager mgr = getPersistenceManager();
			Notification notification;
			//first check to see if this notification exists already
			try {
				notification = mgr.getObjectById(Notification.class, series.getId());
			} catch (javax.jdo.JDOObjectNotFoundException ex) {
				notification = new Notification();
				String message = user.getUsername() + " has added a new series titled " + series.getTitle();
				notification.setId(series.getId());
				notification.setType("series");
				notification.setMessage(message);
				mgr.makePersistent(notification);
			}
			//notify the followers and save
			for (String followerId : user.getFollowers()){
				C4User follower = mgr.getObjectById(C4User.class, followerId);
				if (follower.getNotifications() == null){
					List<Long> list = new ArrayList<Long>();
					follower.setNotifications(list);
				}
				if (!follower.getNotifications().contains(notification.getId())){
					follower.addNotification(notification.getId());
					mgr.makePersistent(follower);
				}
			}
			
			mgr.close();
		}

	}
}
