import React, { useState } from "react";
import TheHeader from "../../components/the-header/the-header";
import AdminCompanyList from "../../components/admin-company-list/admin-company-list";
import SearchBar from "../../components/search-bar/search-bar";
import SortDropdown from "../../components/sort-dropdown/sort-dropdown";
import AdminFilterDropdown from "../../components/admin-filter-dropdown/admin-filter-dropdown";
import BaseButton from "../../components/base-button/base-button";
import ModalBackground from "../../components/modal-background/modal-background";
import DeleteModal from "../../components/modals/modal-delete/modal-delete";
import AddModal from "../../components/modals/modal-add/modal-add";

import * as Firebase from "../../firebase/firebase.utils";

import "./admin-companies.scss";

const AdminCompanies = ({ companyData, readDatabase, handleSignout }) => {
  const [currentCompany, setCurrentCompany] = useState({})
  const [adminSearchTerm, setAdminSearchTerm] = useState('')
  const [adminSortBy, setAdminSortBy] = useState('A-Ö')
  const [filterByCompany, setFilterByCompany] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [updateDBError, setUpdateDBError] = useState('')

  const setSearch = e => {
    setAdminSearchTerm(e.target.value)
  }

  const filterCompanies = e => {
    setFilterByCompany(e.target.value)
  }

  const sortCourses = e => {
    setAdminSortBy(e.target.value)
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      setModalOpen(false)
    }
  })

  //Filter by search term
  const filteredCompaniesBySearch = companyData.filter(
    company =>
      company.namn.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      company.ort.toLowerCase().includes(adminSearchTerm.toLowerCase())
  )

  // Filter by filter term
  let filteredCompaniesByFilter = filteredCompaniesBySearch
  if (filterByCompany === 'IngenUtbildning') {
    filteredCompaniesByFilter = filteredCompaniesBySearch.filter(company => company.utbildningar.length === 0)
  }
  if (filterByCompany === 'ITHSMatchar') {
    filteredCompaniesByFilter = filteredCompaniesBySearch.filter(company => company.ITHSMatchar === true)
  }
  if (filterByCompany === 'Osynlig') {
    filteredCompaniesByFilter = filteredCompaniesBySearch.filter(company => company.synlig === false)
  }
  if (['WU', 'ITP', 'FEU', '.NET', 'JAVA', 'JSU', 'APP', 'TEST'].includes(filterByCompany)) {
    filteredCompaniesByFilter = filteredCompaniesBySearch.filter(company => company.utbildningar.includes(filterByCompany))
  }

  //Sort filtered company list
  let filteredAndSorted = ''

  if (adminSortBy === 'A-Ö') {
    filteredAndSorted = filteredCompaniesByFilter.sort((a, b) => a.namn.localeCompare(b.namn))
  }
  if (adminSortBy === 'Ö-A') {
    filteredAndSorted = filteredCompaniesByFilter.sort((a, b) => b.namn.localeCompare(a.namn))
  }
  if (adminSortBy === 'timestamp') {
    filteredAndSorted = filteredCompaniesByFilter.sort((a, b) => b.timestamp - a.timestamp)
  }

  //Open and close modal with different content
  const toggleModal = (e, data) => {
    e.stopPropagation()
    if (e.target.className === 'modal-background' || e.target.className === 'grey' || e.target.className === 'close-modal-button') {
      setAddModalOpen(false)
      setEditModalOpen(false)
      setDeleteModalOpen(false)
      setCurrentCompany({})
      setModalOpen(!modalOpen)
    }
    if (e.target.innerText === 'LÄGG TILL FÖRETAGET') {
      let alreadyExists = companyData.find(company => company.namn.toLowerCase() === data.namn.toLowerCase())

      if (!alreadyExists) {
        Firebase.db
          .collection('companies')
          .add(data)
          .then(docRef => {
            data.id = docRef.id

            // addCompanyData(data);
            readDatabase()
            console.log('Document created with id:', docRef.id)
            setAddModalOpen(false)
            setEditModalOpen(false)
            setDeleteModalOpen(false)
            setCurrentCompany({})
            setModalOpen(!modalOpen)
          })
          .catch(err => {
            setUpdateDBError('Någonting gick fel ', err)
            console.log(err)
          })
      } else {
        Firebase.db
          .collection('companies')
          .doc(alreadyExists.id)
          .set(data)
          .then(() => {
            data.id = alreadyExists.id

            // updateCompanyData(data);
            readDatabase()
            console.log('Document updated successfully')
            setAddModalOpen(false)
            setEditModalOpen(false)
            setDeleteModalOpen(false)
            setCurrentCompany({})
            setModalOpen(!modalOpen)
          })
          .catch(err => {
            setUpdateDBError('Någonting gick fel ', err)
            console.log(err)
          })
      }
    }

    if (e.target.innerText === 'SPARA ÄNDRINGAR') {
      Firebase.db
        .collection('companies')
        .doc(data.id)
        .set(data)
        .then(() => {
          readDatabase()
          console.log('Document updated successfully')
          setAddModalOpen(false)
          setEditModalOpen(false)
          setDeleteModalOpen(false)
          setCurrentCompany({})
          setModalOpen(!modalOpen)
        })
        .catch(err => {
          setUpdateDBError('Någonting gick fel ', err)
          console.log(err)
        })
    }

    if (e.target.innerText === 'JA - RADERA') {
      Firebase.db
        .collection('companies')
        .doc(data.id)
        .delete()
        .then(() => {
          readDatabase()
          console.log('Document deleted successfully')
          setAddModalOpen(false)
          setEditModalOpen(false)
          setDeleteModalOpen(false)
          setCurrentCompany({})
          setModalOpen(!modalOpen)
        })
        .catch(err => {
          setUpdateDBError('Någonting gick fel ', err)
          console.log(err)
        })
    }

    if (e.target.innerText === 'LÄGG TILL FÖRETAG') {
      setAddModalOpen(true)
      setModalOpen(!modalOpen)
    }
    if (e.target.innerText === 'REDIGERA') {
      handleCurrentCompany(data)
      setEditModalOpen(true)
      //setAddModalOpen(true);
      setModalOpen(!modalOpen)
    }
    if (e.target.innerText === 'RADERA') {
      setDeleteModalOpen(true)
      handleCurrentCompany(data)
      setModalOpen(!modalOpen)
    }
  }

  //To know which company you want to edit/delete:
  const handleCurrentCompany = data => {
    setCurrentCompany({ ...data })
  }

  return (
    <div>
      {modalOpen ? (
        <ModalBackground toggleModal={toggleModal}>
          {addModalOpen ? (
            <AddModal toggleModal={toggleModal} currentCompany={currentCompany} type="add" updateDBError={updateDBError} />
          ) : null}
          {editModalOpen ? (
            <AddModal toggleModal={toggleModal} currentCompany={currentCompany} type="edit" updateDBError={updateDBError} />
          ) : null}
          {deleteModalOpen ? <DeleteModal toggleModal={toggleModal} currentCompany={currentCompany} updateDBError={updateDBError} /> : null}
        </ModalBackground>
      ) : null}
      <TheHeader title="Admin" />
      <main className="admin-wrapper">
        <button className="log-out-btn" onClick={e => handleSignout(e)}>
          Log out
        </button>
        <section className="search-wrapper">
          <section className="admin-search">
            <SearchBar searchTerm={adminSearchTerm} setSearch={setSearch} />
            <AdminFilterDropdown filterCompanies={filterCompanies} />
            <SortDropdown sortCourses={sortCourses} />
          </section>

          <section className="add-company">
            <BaseButton color="danger" toggleModal={toggleModal}>
              Lägg till företag
            </BaseButton>
          </section>
        </section>
        {companyData ? (
          <AdminCompanyList companyData={filteredAndSorted} toggleModal={toggleModal} handleCurrentCompany={handleCurrentCompany} />
        ) : (
          <h6>Loading...</h6>
        )}
      </main>
    </div>
  )
}

export default AdminCompanies;
