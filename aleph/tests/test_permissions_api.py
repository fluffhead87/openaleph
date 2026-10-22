import json

from aleph.tests.util import JSON, TestCase


class PermissionsApiTestCase(TestCase):
    def setUp(self):
        super(PermissionsApiTestCase, self).setUp()
        self.admin = self.create_user(foreign_id="admin", is_admin=True)
        self.user = self.create_user(foreign_id="user")
        self.other = self.create_user(foreign_id="other")
        self.casefile = self.create_collection(
            creator=self.user, label="Investigation", foreign_id="casefile"
        )
        self.dataset = self.create_collection(
            creator=self.admin,
            label="Dataset",
            foreign_id="dataset",
            category="leak",
        )
        self.grant(self.dataset, self.user, True, True)

    def _update(self, collection, headers, write=False):
        data = [{"role_id": str(self.other.id), "read": True, "write": write}]
        url = f"/api/2/collections/{collection.id}/permissions"
        return self.client.post(
            url, data=json.dumps(data), headers=headers, content_type=JSON
        )

    def test_casefile_writer_can_manage(self):
        _, headers = self.login(foreign_id="user")
        url = f"/api/2/collections/{self.casefile.id}/permissions"
        res = self.client.get(url, headers=headers)
        assert res.status_code == 200, res
        res = self._update(self.casefile, headers)
        assert res.status_code == 200, res

        res = self.client.get(f"/api/2/collections/{self.casefile.id}", headers=headers)
        assert res.json["shareable"] is True, res.json

    def test_dataset_writer_cannot_manage(self):
        _, headers = self.login(foreign_id="user")
        url = f"/api/2/collections/{self.dataset.id}/permissions"
        res = self.client.get(url, headers=headers)
        assert res.status_code == 403, res
        res = self._update(self.dataset, headers, write=True)
        assert res.status_code == 403, res

        res = self.client.get(f"/api/2/collections/{self.dataset.id}", headers=headers)
        assert res.status_code == 200, res
        assert res.json["writeable"] is True, res.json
        assert res.json["shareable"] is False, res.json

        _, headers = self.login(foreign_id="other")
        res = self.client.get(f"/api/2/collections/{self.dataset.id}", headers=headers)
        assert res.status_code == 403, res

    def test_dataset_admin_can_manage(self):
        _, headers = self.login(foreign_id="admin", is_admin=True)
        url = f"/api/2/collections/{self.dataset.id}/permissions"
        res = self.client.get(url, headers=headers)
        assert res.status_code == 200, res
        res = self._update(self.dataset, headers)
        assert res.status_code == 200, res

        res = self.client.get(f"/api/2/collections/{self.dataset.id}", headers=headers)
        assert res.json["shareable"] is True, res.json

        _, headers = self.login(foreign_id="other")
        res = self.client.get(f"/api/2/collections/{self.dataset.id}", headers=headers)
        assert res.status_code == 200, res
        assert res.json["writeable"] is False, res.json
