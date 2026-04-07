package com.dev.HiddenBath.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.HiddenBath.model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>{

}
