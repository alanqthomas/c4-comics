package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityExistsException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "userendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class UserEndpoint {

	/**
	 * This method lists all the entities inserted in datastore.
	 * It uses HTTP GET method and paging support.
	 *
	 * @return A CollectionResponse class containing the list of all entities
	 * persisted and a cursor to the next page.
	 */
	@SuppressWarnings({ "unchecked", "unused" })
	@ApiMethod(name = "listUser")
	public CollectionResponse<User> listUser(
			@Nullable @Named("cursor") String cursorString,
			@Nullable @Named("limit") Integer limit) {

		PersistenceManager mgr = null;
		Cursor cursor = null;
		List<User> execute = null;

		try {
			mgr = getPersistenceManager();
			Query query = mgr.newQuery(User.class);
			if (cursorString != null && cursorString != "") {
				cursor = Cursor.fromWebSafeString(cursorString);
				HashMap<String, Object> extensionMap = new HashMap<String, Object>();
				extensionMap.put(JDOCursorHelper.CURSOR_EXTENSION, cursor);
				query.setExtensions(extensionMap);
			}

			if (limit != null) {
				query.setRange(0, limit);
			}

			execute = (List<User>) query.execute();
			cursor = JDOCursorHelper.getCursor(execute);
			if (cursor != null)
				cursorString = cursor.toWebSafeString();

			// Tight loop for fetching all entities from datastore and accomodate
			// for lazy fetch.
			for (User obj : execute)
				;
		} finally {
			mgr.close();
		}

		return CollectionResponse.<User> builder().setItems(execute)
				.setNextPageToken(cursorString).build();
	}

	/**
	 * This method gets the entity having primary key id. It uses HTTP GET method.
	 *
	 * @param id the primary key of the java bean.
	 * @return The entity with primary key id.
	 */
	@ApiMethod(name = "getUser")
	public User getUser(@Named("id") String googleID) {
		PersistenceManager mgr = getPersistenceManager();
		Key k = KeyFactory.createKey(User.class.getSimpleName(), googleID);
		User user = null;
		try {
			if (containsUser(k))
				user = mgr.getObjectById(User.class, k);
		} 
		finally {
			mgr.close();
		}
		return user;
	}

	/**
	 * This inserts a new entity into App Engine datastore. If the entity already
	 * exists in the datastore, an exception is thrown.
	 * It uses HTTP POST method.
	 *
	 * @param user the entity to be inserted.
	 * @return The inserted entity.
	 */
	@ApiMethod(name = "insertUser")
	public User insertUser(User user) {
		PersistenceManager mgr = getPersistenceManager();
		Key k = KeyFactory.createKey(User.class.getSimpleName(), user.getGoogleID());
		User newUser = null;
		try {
			if (containsUser(k)) {
				throw new EntityExistsException("Object already exists");
			}
			newUser = new User(k, user.getGoogleID(), user.getEmail(), user.getUsername(), user.isAdministrator());
			mgr.makePersistent(user);
		} finally {
			mgr.close();
		}
		return newUser;
	}

	/**
	 * This method adds the specified seriesKey to the specified user's created series list
	 * @param googleID the user's googleID
	 * @param seriesKey the key of the series to add to the user's list
	 */
	@ApiMethod(name="addUserSeries")
	public void addUserSeries(@Named("id") String googleID, Key seriesKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		List<Key> list;
		if (user.getUserSeries() == null){
			list = new ArrayList<Key>();
			user.setUserSeries(list);
		}
		else
			list = user.getUserSeries();
		list.add(seriesKey);
		
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method removes a specified series from the list of series the user has created.
	 * @param googleID the user's googleID
	 * @param seriesKey the key of the series to delete from the user's list
	 * @return
	 */
	@ApiMethod(name="deleteUserSeries")
	public void deleteUserSeries(@Named("id") String googleID, Key seriesKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		user.getUserSeries().remove(seriesKey);
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method adds the specified author's key to the specified user's favorites list
	 * @param googleID the user's googleID
	 * @param authorKey the key of the author to add to the user's list
	 */
	@ApiMethod(name="addFavorite")
	public void addFavorite(@Named("id") String googleID, Key authorKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		List<Key> list;
		if (user.getFavorites() == null){
			list = new ArrayList<Key>();
			user.setFavorites(list);
		}
		else
			list = user.getFavorites();
		list.add(authorKey);
		
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method removes an author's key from the list of a user's favorites
	 * @param googleID the user's googleID
	 * @param authorKey the key of the author to delete from the user's favorites list
	 * @return
	 */
	@ApiMethod(name="deleteFavorite")
	public void deleteFavorite(@Named("id") String googleID, Key authorKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		user.getFavorites().remove(authorKey);
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method adds the specified series key to the specified user's subscription list
	 * @param googleID the user's googleID
	 * @param seriesKey the key of the series to add to the user's subscription list
	 */
	@ApiMethod(name="addSubscription")
	public void addSubscription(@Named("id") String googleID, Key seriesKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		List<Key> list;
		if (user.getSubscriptions() == null){
			list = new ArrayList<Key>();
			user.setSubscriptions(list);
		}
		else
			list = user.getSubscriptions();
		list.add(seriesKey);
		
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method removes an author's key from the list of a user's subscriptions
	 * @param googleID the user's googleID
	 * @param authorKey the key of the series to delete from the user's list
	 * @return
	 */
	@ApiMethod(name="deleteSubscription")
	public void deleteSubscription(@Named("id") String googleID, Key seriesKey){
		PersistenceManager mgr = getPersistenceManager();
		User user = getUser(googleID);
		user.getSubscriptions().remove(seriesKey);
		mgr.makePersistent(user);
		mgr.close();
	}
	
	/**
	 * This method removes the entity with primary key id.
	 * It uses HTTP DELETE method.
	 *
	 * @param id the primary key of the entity to be deleted.
	 */
	@ApiMethod(name = "removeUser")
	public void removeUser(@Named("id") String googleID) {
		PersistenceManager mgr = getPersistenceManager();
		Key k = KeyFactory.createKey(User.class.getSimpleName(), googleID);
		try {
			User user = mgr.getObjectById(User.class, k);
			mgr.deletePersistent(user);
		} finally {
			mgr.close();
		}
	}

	private boolean containsUser(Key k) {
		PersistenceManager mgr = getPersistenceManager();
		boolean contains = true;
		try {
			mgr.getObjectById(User.class, k);
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
