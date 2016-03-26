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
	//	public User(Key k, String email, String username, boolean administrator){
	public User insertUser(@Named("id") String googleID,@Named("email") String email,
			@Named("username") String username,@Named("admin") boolean admin) {
		PersistenceManager mgr = getPersistenceManager();
		Key k = KeyFactory.createKey(User.class.getSimpleName(), googleID);
		User newUser = null;
		try {
			if (containsUser(k)) {
				throw new EntityExistsException("User already exists");
			}
			newUser = new User(k, email, username, admin);
			mgr.makePersistent(newUser);
		} finally {
			mgr.close();
		}
		return newUser;
	}

	/*
	 *  UPDATE METHODS TO BE ADDED
	 */
	
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
