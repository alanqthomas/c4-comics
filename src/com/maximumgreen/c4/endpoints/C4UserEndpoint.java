package com.maximumgreen.c4.endpoints;

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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.lang.Long;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

//import com.google.api.server.spi.response.*;

@Api(name = "c4userendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class C4UserEndpoint {

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
	public C4User updateC4User(C4User c4user) throws BadRequestException {
		if (c4user.getUserID() == null)
			throw new BadRequestException("One or more required fields are missing");
		PersistenceManager mgr = getPersistenceManager();
		try {
			if (!containsC4User(c4user)) {
				throw new EntityNotFoundException("Object does not exist");
			}
			mgr.makePersistent(c4user);
		} finally {
			mgr.close();
		}
		return c4user;
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
		} finally {
			mgr.close();
		}
	}

	//CUSTOM METHODS
	
	/**
	 * This method adds the specified series id to the specified user's subscription list
	 * @param userId the user's unique user id
	 * @param seriesId the id of the series to add to the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="addsubscription")
	public void addSubscription(@Named("userId") String userId, @Named("seriesId") Long seriesId)
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
	}
	
	/**
	 * This method deletes the specified series id to the specified user's subscription list
	 * @param googleId the user's googleId
	 * @param seriesId the id of the series to delete from the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="deletesubscription")
	public void deleteSubscription(@Named("userId") String userId, @Named("seriesId") Long seriesId)
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
	}
	
	/**
	 * This method adds the specified author key to the specified user's follow list
	 * @param userId the user's unique user id
	 * @param seriesId the id of the author to add to the user's follow list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="addfollow")
	public void addFollow(@Named("userId") String userId, @Named("authorId") String authorId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
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
	}
	
	/**
	 * This method deletes the specified author id to the specified user's follow list
	 * @param googleId the user's googleId
	 * @param authorId the id of the series to delete from the user's subscription list
	 * @throws NotFoundException 
	 * @throws BadRequestException 
	 */
	@ApiMethod(name="deletefollow")
	public void deleteFollow(@Named("userId") String userId, @Named("authorId") String authorId)
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
	public void addFavorite(@Named("userId") String userId, 
			@Nullable @Named("authorId") String authorId, @Nullable @Named("otherId") Long otherId)
			throws BadRequestException, NotFoundException{
		PersistenceManager mgr = getPersistenceManager();
		
		if (authorId == null && otherId == null)
			throw new BadRequestException("Both Ids cannot be null");
		if (authorId != null && otherId != null)
			throw new BadRequestException("One Id must be null");
		
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
			
			if (otherId != null){
				if (user.getFavorites() == null){
					List<Long> list = new ArrayList<Long>();
					user.setFavorites(list);
				}
				user.addFavorite(otherId);
			}
			
			mgr.makePersistent(user);
			
		} catch (javax.jdo.JDOObjectNotFoundException ex){
			throw new EntityNotFoundException("User id invalid");
		} finally {
			mgr.close();
		}
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

}
